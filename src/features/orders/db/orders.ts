import { authCheck } from "@/features/auths/db/auths";
import { redirect } from "next/navigation";
import { canCreateOrder } from "../permission/orders";
import { checkoutSchema } from "../schema/orders";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/generateOrderNumber";
import { clearCart } from "@/features/cart/db/carts";
import { getOrderIdTag, revalidateOrderCache } from "./cache";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import formatDate from "@/lib/formatDate";

interface checkoutInput {
  address: string;
  phone: string;
  note?: string;
  useProfileData?: string;
}

export const createOrder = async (input: checkoutInput) => {
  const user = await authCheck();

  if (!user || !canCreateOrder(user)) {
    redirect("/auth/signin");
  }

  try {
    // เก็บค่าจาก switch ว่ามีค่า on มั้ย true / false
    const useProfileData = input.useProfileData === "on";

    // เช็ค useProfileData ต้องเป็น true ที่อยู่ของ user ที่กรอกมาตอนแรกต้องมีค่า และ เบอร์ของ user ต้องมีค่า
    if (useProfileData && user.address && user.tel) {
      input.address = user.address; // เปลี่ยนแปลงค่าใน input เป็นค่าเดียวกับค่าใน user
      input.phone = user.tel;
    }

    const { data, error, success } = checkoutSchema.safeParse(input);

    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    // เช็คตะกร้า
    const cart = await db.cart.findFirst({
      where: {
        orderedById: user.id,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // เช็คว่าในตะกร้ามีสินค้ามั้ย โดยเช็คของในตะกร้า
    if (!cart || cart.cartItems.length === 0) {
      return {
        message: "ไม่พบสินค้าในตะกร้า",
      };
    }

    const shippingFee = 50;

    const orderNumber = generateOrderNumber();

    // คิดราคารวม
    const totalAmount = cart.cardTotal * shippingFee;

    // คำสั่งซื้อใหม่
    const newOrder = await db.$transaction(async (prisma) => {
      // สร้าง order
      const order = await prisma.order.create({
        data: {
          orderNumber: orderNumber,
          totalAmount: totalAmount,
          status: "Pending",
          address: data.address,
          phone: data.phone,
          note: data.note,
          shippingFee: shippingFee,
          customerId: user.id, // user คือใครที่สั่งซื้อ
        },
      });

      for (const item of cart.cartItems) {
        const product = await prisma.product.findUnique({
          where: {
            id: item.productId,
          },
          include: {
            images: true,
          },
        });

        if (!product || product.stock < item.count) {
          throw new Error(`สินค้า ${product?.title} มีไม่เพียงพอ`);
        }

        const mainImage = product.images.find((image) => image.isMain);

        // create OrderItem ข้างใน order โดยใน 1 order จะมี orderItem ได้หลายตัว และ orderItem หลายตัวจะมี product มีได้ 1 product
        await prisma.orderItem.create({
          data: {
            quantity: item.count,
            price: product.price, // ราคาของสินค้าแต่ละตัว
            totalPrice: item.price,
            productTitle: product.title,
            productImage: mainImage?.url || null,
            orderId: order.id,
            productId: item.productId,
          },
        });

        await prisma.product.update({
          where: {
            id: item.productId,
          },
          data: {
            sold: product.sold + item.count, // update โดยการ ขายไปแล้ว + จำนวนที่ซื้อของ productId นี้ที่มาจาก cartItem
            stock: product.stock - item.count, // update โดยการ stock - จำนวนที่ซื้อของ productId นี้ที่มาจาก cartItem
          },
        });
      }

      return order;
    });

    if (!newOrder) {
      return {
        message: "เกิดข้อผิดพลาดในการสั่งซื้อ",
      };
    }

    // เมื่อสั่งซื้อสำเร็จก็ clear cart ให้โล่ง เพราะซื้อไปแล้ว
    await clearCart();

    revalidateOrderCache(newOrder.id, user.id);

    return {
      orderId: newOrder.id,
    };
  } catch (error) {
    console.error("Error creating order:", error);

    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }
    return {
      message: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองใหม่ในภายหลัง",
    };
  }
};

// อยากจะใช้ useCache จะไม่สามรถใช้ร่วมกับ authCheck ได้
export const getOrderById = async (userId: string, orderId: string) => {
  "use cache";

  if (!userId) {
    redirect("/auth/signin");
  }
  cacheLife("minutes");
  cacheTag(getOrderIdTag(orderId));
  try {
    const order = await db.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return null;
    }

    const items = order.items.map((item) => {
      const mainImage = item.product.images.find((image) => image.isMain);

      return {
        ...item,
        product: {
          ...item.product,
          mainImage,
          lowStock: 5,
          sku: item.product.id.substring(0, 8),
        },
      };
    });

    return {
      ...order,
      items,
      createAtFormatted: formatDate(order.createdAt),
      paymentAtFormatted: order.paymentAt ? formatDate(order.paymentAt) : null,
    };
  } catch (error) {
    console.error(`Error getting order ${orderId}`, error);
    return null;
  }
};

export const uploadPaymentSlip = async (orderId: string, file: File) => {
  const user = await authCheck();

  if (!user) {
    redirect("/auth/signin");
  }

  try {
  } catch (error) {
    console.error("error uploading payment slip", error);
    return {
      message: "เกิดข้อผิดพลาดในการอัพโหลดสลิปการชำระเงิน",
    };
  }
};

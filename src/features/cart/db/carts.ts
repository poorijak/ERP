import { redirect } from "next/navigation";
import {
  unstable_cacheTag as cacheTag,
  unstable_cacheLife as cacheLife,
} from "next/cache";
import { getCartTag, reavalidateCartCache } from "./cache";
import { db } from "@/lib/db";
import { authCheck } from "@/features/auths/db/auths";
import { canUpdateUserCart } from "../permissions/cart";

interface AddtoCartInput {
  productId: string;
  count: number;
}

interface UpdateCartInput {
  cartItemId: string;
  newCount: number;
}

export const getUserCart = async (userId: string | null) => {
  "use cache";

  cacheLife("hours");
  cacheTag(getCartTag(userId));

  // permission
  if (!userId) {
    redirect("/auth/signin");
  }

  try {
    const cart = await db.cart.findFirst({
      where: {
        orderedById: userId,
      },
      
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!cart) return null;

    const cartWithDetails = {
      ...cart,
      items: cart.cartItems.map((cartItems) => {
        // cart จะมี cartItems ได้หลายอัน
        const mainImage = cartItems.product.images.find(
          (image) => image.isMain
        );

        return {
          id: cartItems.id,
          count: cartItems.count,
          price: cartItems.price,
          product: {
            // เราต้องใส่ข้อมูลให้ครบตาม type ถ้าเราจะใช้ product
            ...cartItems.product,
            mainImage: mainImage || null,
            lowStock: 5,
            sku: cartItems.product.id.substring(0, 8).toUpperCase(),
          },
        };
      }),
      itemCount: cart.cartItems.reduce((sum, item) => sum + item.count, 0), // ผลรวมของของในตะกร้า
    };

    return cartWithDetails;
  } catch (error) {
    console.error("Error getting user cart", error);
    return null;
  }
};

// get จำนวนของของในตะกร้า
export const getCartItemCount = async (userId: string | null) => {
  "use cache";
  if (!userId) {
    redirect("/auth/signin");
  }
  cacheLife("hours");
  cacheTag(getCartTag(userId));

  try {
    const cart = await db.cart.findFirst({
      where: {
        orderedById: userId,
      },
      include: {
        cartItems: true, // เอาของในตะกร้าออกมา
      },
    });

    if (!cart) return 0;

    return cart.cartItems.reduce((sum, item) => sum + item.count, 0); // นับจำนวนของของในตะกร้า
  } catch (error) {
    console.error("error getting cart item cout", error);
    return 0;
  }
};

// คำนวณ cartTotal (ราคา) ของของทั้งหมดใน cart
export const recalculateCartTotal = async (cartId: string) => {
  // ดึงข้อมูลทั้งหมดของ ของในตะกร้า
  const cartItems = await db.cartItem.findMany({
    where: {
      cartId,
    },
  });

  // ราคารวมของ ของทั้งหมดในตะกร้า
  const cartTotal = cartItems.reduce((total, items) => total + items.price, 0);

  // อัพเดตราคารวมของของในตะกร้า
  await db.cart.update({
    where: { id: cartId },
    data: {
      cardTotal: cartTotal,
    },
  });
};

export const addToCart = async (input: AddtoCartInput) => {
  const user = await authCheck();

  if (!user || !canUpdateUserCart(user)) {
    redirect("auth/signin");
  }
  try {
    // ดึง product ที่ active มา
    const product = await db.product.findUnique({
      where: {
        id: input.productId,
        status: "Active",
      },
    });

    if (!product) {
      return {
        message: "ไม่พบสินค้าหรือไม่มีจำหน่าย",
      };
    }

    if (!product) return null;

    // เช็คว่า count ที่ส่งมา มีมากกว่า stock ที่เหลืออยู่มั้ย
    if (product.stock < input.count) {
      return {
        message: "สต๊อกสินค้าไม่เพียงพอ",
      };
    }

    // เช็คว่ามี cart หรือยัง (เคยสร้าง cart หรือยัง) ถ้ายังสร้างใหม่ ถ้ามีแล้วเพิ่ม product กับ count เข้าไปใน cart เดิม
    let cart = await db.cart.findFirst({
      where: {
        orderedById: user.id, // หาตะกร้าด้วย user.id เพราะว่าถ้ามีตะกร้าจะอ้างอิงด้วย user.id
      },
    });

    // ถ้า user ไม่มี cart อยู่เลย
    if (!cart) {
      cart = await db.cart.create({
        data: {
          cardTotal: 0,
          orderedById: user.id, // สร้างตะกร้าของ user ใหม่ถ้า !cart
        },
      });
    }

    // ดึงข้อมูล product ที่กำลังจะ add ที่อยู่ใน cartItem แต่ชิ้นมา
    const existingCartProduct = await db.cartItem.findFirst({
      where: { cartId: cart.id, productId: product.id }, // โดยดูจาก product.id ที่ add เข้ามา
    });

    // เช็คว่าถ้า ของในตะกร้า นั้นมี product ที่จะ add ให้ทำการ update
    if (existingCartProduct) {
      await db.cartItem.update({
        where: {
          id: existingCartProduct.id, // โดย update ที่ cartItem ที่มี product นั้นอยู่
        },
        data: {
          count: existingCartProduct.count + input.count, // เอา cout ของ product ที่มีอยู่แล้ว + count ที่ add มาใหม่
          price:
            existingCartProduct.price *
            (existingCartProduct.count + input.count),
        },
      });
    } else {
      // ถ้า product ใน cartItems ไม่ซ้ำ
      await db.cartItem.create({
        data: {
          count: input.count,
          price: product.price * input.count,
          cartId: cart.id,
          productId: product.id,
        },
      });
    }

    await recalculateCartTotal(cart.id);

    reavalidateCartCache(user.id);
  } catch (error) {
    console.error("Error getting adding to cart", error);
    return {
      message: "เกิดข้อผิดพลาดในการเพิ่มสินค้าลงในตะกร้า",
    };
  }
};

export const updateCartItem = async (input: UpdateCartInput) => {
  const user = await authCheck();

  if (!user || !canUpdateUserCart) {
    redirect("/auth/sigin");
  }

  try {
    if (input.newCount < 1) {
      return {
        message: "จำนวนสินค้าต้องมีอย่างน้อย 1 ชิ้น",
      };
    }

    // ดึง cartItem ตาม cartItemId จาก input ว่าเรากำลังทำการ update จาก cartItem ตัวไหน
    const existingCartItem = await db.cartItem.findUnique({
      where: {
        id: input.cartItemId,
      },
      include: {
        cart: true,
        product: true,
      },
    });

    // ถ้า หาสินค้าไม่เจอ หรือ หาสินค้าเจอแต่คนที่สร้าง cart ไม่ใช่คนที่กำลัง update
    if (!existingCartItem || existingCartItem.cart.orderedById !== user.id) {
      return {
        message: "ไม่พบสินค้าในตะกร้า",
      };
    }

    // เช็คถ้า stock มีน้อยกว่า input ที่เพิ่มเข้ามา
    if (existingCartItem.product.stock < input.newCount) {
      return {
        message: "สต๊อกสินค้าไม่เพียงพอ",
      };
    }

    await db.cartItem.update({
      where: {
        id: input.cartItemId,
      },
      data: {
        count: input.newCount,
        price: existingCartItem.product.price * input.newCount, // อัพเดตค่ารวม่ทั้งหมดของ cartItem
      },
    });

    await recalculateCartTotal(existingCartItem.cartId);

    reavalidateCartCache(user.id);
  } catch (error) {
    console.error("Error updating cart ", error);
    return {
      message: "เกิดข้อผิดพลาดในการอัพเดตตะกร้าสินค้า",
    };
  }
};

export const removeFormCart = async (cartItemId: string) => {
  const user = await authCheck();

  if (!user || !canUpdateUserCart(user)) {
    redirect("/auth/signin");
  }
  try {
    const cartItem = await db.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
      include: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.orderedById !== user.id) {
      return {
        message: "ไม่พบสินค้าในตะกร้า",
      };
    }

    await db.cartItem.delete({
      where: { id: cartItemId },
    });

    await recalculateCartTotal(cartItem.cartId);

    reavalidateCartCache(user.id);
  } catch (error) {
    console.error("error removing from cart", error);
    return {
      message: "ไม่สามารถลบรายการสินค้านี้ออกจากตะกร้าได้",
    };
  }
};

export const clearCart = async () => {
  const user = await authCheck();

  if (!user || !canUpdateUserCart(user)) {
    redirect("/auth/signin");
  }
  try {
    const cart = await db.cart.findFirst({
      where: {
        orderedById: user.id,
      },
    });

    if (!cart) {
      return {
        message: "ตะกร้าของคุณว่างเปล่า",
      };
    }

    await db.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });


    await db.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        cardTotal: 0,
      },
    });

    reavalidateCartCache(user.id);
  } catch (error) {
    console.error("Error clearing cart", error);
    return {
      message: "ไม่สามารถลบสินค้าทั้งหมดได้",
    };
  }
};

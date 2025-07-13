import { db } from "@/lib/db";
import {
  unstable_cacheTag as cacheTag,
  unstable_cacheLife as cacheLife,
} from "next/cache";
import {
  getProductIdTag,
  getProductsGlobalTag,
  revalidateProductCache,
} from "./cache";
import { ProductSchema } from "../schema/product";
import { authCheck } from "@/features/auths/db/auths";
import { canCreateProduct, canUpdateProduct } from "../permissions/product";
import { redirect } from "next/navigation";
import { deleteFromImageKit } from "@/lib/imagekit";
import { ProductStatus } from "@prisma/client";

interface CreateProductInput {
  title: string;
  description: string;
  cost?: number;
  basePrice: number;
  price: number;
  stock: number;
  categoryId: string;
  mainImageIndex: number;
  images: Array<{ url: string; fileId: string }>;
}

export const getProducts = async () => {
  "use cache";

  cacheLife("hours");
  cacheTag(getProductsGlobalTag());

  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        images: true,
      },
    });

    return products.map((product) => {
      const mainImage = product.images.find((image) => image.isMain);

      return {
        ...product,
        lowStock: 5,
        sku: product.id.substring(0, 8).toUpperCase(),
        mainImage: mainImage,
      };
    });
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};

// getFeatureProduct
export const getFeatureProduct = async () => {
  "use cache";

  cacheLife("hours");
  cacheTag(getProductsGlobalTag());

  try {
    const product = await db.product.findMany({
      take: 8,
      where: {
        status: "Active",
      },
      orderBy: {
        sold: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        images: true,
      },
    });

    return product.map((p) => {
      const mainImage = p.images.find((image) => image.isMain);

      return {
        ...p,
        lowStock: 5,
        sku: p.id.substring(0, 8),
        mainImage,
      };
    });
  } catch (error) {
    console.error("Erro getting feature products: ", error);
    return [];
  }
};

export const getProductsbyId = async (id: string) => {
  "use cache";

  cacheLife("hours");
  cacheTag(getProductIdTag(id));

  try {
    const product = await db.product.findFirst({
      where: {
        id: id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        images: true,
      },
    });

    if (!product) {
      return null;
    }

    // finding main image
    const mainImage = product.images.find((image) => image.isMain);

    // finding mainImageIndex
    const mainImageIndex = mainImage
      ? product.images.findIndex((image) => image.isMain)
      : 0;

    return {
      ...product,
      lowStock: 5,
      sku: product.id.substring(0, 8).toUpperCase(),
      mainImage: mainImage || null,
      mainImageIndex,
    };
  } catch (error) {
    console.error("Error getting product by id : ", error);
    return null;
  }
};

export const createProduct = async (input: CreateProductInput) => {
  const user = await authCheck();

  if (!user || !canCreateProduct(user)) {
    redirect("/");
  }

  try {
    const { success, data, error } = ProductSchema.safeParse(input);

    if (!success) {
      console.log(error.flatten().fieldErrors);
      return {
        message: "Please enter valid product information",
        error: error.flatten().fieldErrors,
      };
    }

    const category = await db.category.findUnique({
      where: {
        id: data.categoryId,
        status: "Active",
      },
    });

    if (!category) {
      return {
        message: "Selected category not found or inactive",
      };
    }

    // create new product
    const NewProduct = await db.$transaction(async (prisma) => {
      const product = await prisma.product.create({
        data: {
          title: data.title,
          description: data.description,
          cost: data.cost,
          basePrice: data.basePrice,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId,
        },
      });

      // เพิ่มรูป

      if (input.images && input.images.length > 0) {
        await Promise.all(
          input.images.map((image, index) => {
            return prisma.productImage.create({
              data: {
                url: image.url,
                fileId: image.fileId,
                isMain: input.mainImageIndex === index,
                productId: product.id,
              },
            });
          })
        );
      }

      return product;
    });
    revalidateProductCache(NewProduct.id);
  } catch (error) {
    console.log("Error creating product :", error);
    return {
      message: "Something went wrong. Please try again later",
    };
  }
};

export const updateProduct = async (
  input: CreateProductInput & {
    id: string;
    deletedImageId: string[];
  }
) => {
  const user = await authCheck();
  if (!user || !canUpdateProduct(user)) {
    redirect("/");
  }
  try {
    const { success, data, error } = ProductSchema.safeParse(input);

    if (!success) {
      return {
        message: "Please enter valid product information",
        error: error.flatten().fieldErrors,
      };
    }

    const ExistingProduct = await db.product.findUnique({
      where: {
        id: input.id,
      },
      include: {
        images: true,
      },
    });

    if (!ExistingProduct) {
      return {
        message: "Product not found",
      };
    }

    const category = db.category.findUnique({
      where: { id: input.categoryId, status: "Active" },
    });

    if (!category) {
      return {
        message: "Selected category not found",
      };
    }

    if (input.deletedImageId && input.deletedImageId.length > 0) {
      for (const deletedImageId of input.deletedImageId) {
        const imageToDelete = ExistingProduct.images.find(
          (image) => image.id === deletedImageId
        );

        if (imageToDelete) {
          await deleteFromImageKit(imageToDelete.fileId);
        }
      }
    }

    const updateProduct = await db.$transaction(async (prisma) => {
      // 1. อัพเดตข้อมูลสิ้นค้า
      const product = await prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          title: data.title,
          description: data.description,
          categoryId: data.categoryId,
          cost: data.cost,
          basePrice: data.basePrice,
          price: data.price,
          stock: data.stock,
        },
      });

      // 2. ลบรูปภาพที่เลือก
      if (input.deletedImageId && input.deletedImageId.length > 0) {
        await prisma.productImage.deleteMany({
          where: {
            id: {
              in: input.deletedImageId,
            },
            productId: product.id,
          },
        });
      }

      // 3. set isMain ใน ProductImage ให้เป็น false ให้หมด
      await prisma.productImage.updateMany({
        where: {
          productId: product.id,
        },
        data: {
          isMain: false,
        },
      });

      // 4 เพิ่มรูปภาพใหม่ เพราะ user อาจจะเพิ่มภาพใหม่เข้ามา
      if (input.images && input.images.length > 0) {
        await Promise.all(
          input.images.map((image) => {
            return prisma.productImage.create({
              data: {
                url: image.url,
                fileId: image.fileId,
                isMain: false,
                productId: product.id,
              },
            });
          })
        );
      }

      // 5. เอารูปภาพทั้งหมดใน productId นี้มาหาว่า Ismain ตัวไหนเป็น true
      const allImages = await prisma.productImage.findMany({
        where: {
          productId: product.id,
        },
        orderBy: {
          createdAt: "asc", // เรียงตามรูปที่อัพโหลดเก่าไปใหม่ เพื่อกันบัค index เพี้ยน เพราะถ้าเรียงจาก มากมา index รูปเก่าที่ไม่ได้ลบจะเพี้ยน เพราะตาม logic รูปใหม่ควรต่อท้าย
        },
      });

      if (allImages.length > 0) {
        const validIndex = Math.min(input.mainImageIndex, allImages.length - 1); // ถ้าเรามี mainIndex 1 เราจะทำการเทียบกับ รูปภาพทั้งหมดที่เรา get มา ที่ต้องลบ 1 เพราะว่า allImage เป็นจำนวนของรูปทั้งหมด ถ้าเราจะเอามาเทียบกับ mainIndex ที่เก็บ index เราต้องทำการ -1 เพื่อให้มันเท่ากัน เพราะ index เริ่มจาก 0 - n แต่ จำนวนรูปเริ่มจาก 1 - n ซึ่งมันห่างกัน 1
        if (validIndex >= 0) {
          await prisma.productImage.update({
            where: {
              id: allImages[validIndex].id, // เข้าถึงรูปภาพใน array ของ allImgae ใน index ที่ validIndex เก็บไว้
            },
            data: {
              isMain: true,
            },
          });
        }
      }

      console.log(product);

      return product;
    });

    revalidateProductCache(updateProduct.id);
  } catch (error) {
    console.error("Error updating product : ", error);
    return {
      message: "something went wrong. Please try again later",
    };
  }
};

export const changeProductStatus = async (
  id: string,
  status: ProductStatus
) => {
  try {
    const existingProduct = await db.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return {
        message: "Product not found",
      };
    }

    if (existingProduct.status === status) {
      return {
        message: `Product already ${status.toLowerCase()}`,
      };
    }

    const updateStatus = await db.product.update({
      where: {
        id,
      },
      data: {
        status: status,
      },
    });

    revalidateProductCache(updateStatus.id);
  } catch (error) {
    console.error("error chaging status product : ", error);
    return {
      message: "Someting went wrong , Plase try again later",
    };
  }
};

export const removeProduct = async (id: string) => {
  return await changeProductStatus(id, "Inactive");
};
export const reStoreProduct = async (id: string) => {
  return await changeProductStatus(id, "Active");
};

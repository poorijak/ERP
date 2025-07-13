"use server";

import { InitialFormState } from "@/types/action";
import {
  createProduct,
  removeProduct,
  reStoreProduct,
  updateProduct,
} from "../db/products";
import { uploadToImagekit } from "@/lib/imagekit";

export const productAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const rawData = {
    id: formData.get("product-id") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    categoryId: formData.get("category-id") as string,
    cost: formData.get("cost") as string,
    basePrice: formData.get("base-price") as string,
    price: formData.get("sale-price") as string,
    stock: formData.get("stock") as string,
    images: formData.getAll("images") as File[],
    mainImageIndex: formData.get("mainImageIndex") as string,
    deletedImageId: formData.get("deleted-image-ids") as string, // เพิ่มมาตอน update
  };

  const processedData = {
    ...rawData,
    cost: rawData.cost ? parseFloat(rawData.cost) : undefined,
    basePrice: rawData.basePrice ? parseFloat(rawData.basePrice) : 0,
    price: rawData.price ? parseFloat(rawData.price) : 0,
    stock: rawData.stock ? parseFloat(rawData.stock) : 0,
    mainImageIndex: rawData.mainImageIndex
      ? parseInt(rawData.mainImageIndex)
      : 0,
    deletedImageId: rawData.deletedImageId
      ? (JSON.parse(rawData.deletedImageId) as string[])
      : [],
  };
  const uploadedImage = [];

  for (const imageFile of processedData.images) {
    const uploadResult = await uploadToImagekit(imageFile, "product");

    if (uploadResult && !uploadResult.message) {
      uploadedImage.push({
        url: uploadResult.url || "",
        fileId: uploadResult.fileId || "",
      });
    }
  }

  // ทำการให้มันสลับระหว่าง update และ create โดยดูจาก id เพราะว่า update จะทำการ append id แนบมาด้วย
  const result = processedData.id
    ? await updateProduct({
        ...processedData,
        images: uploadedImage,
      })
    : await createProduct({
        ...processedData,
        images: uploadedImage,
      });

  return result && result.message
    ? {
        success: false,
        message: result.message,
        errors: result.error,
      }
    : {
        success: true,
        message: processedData.id
          ? "Update Product succesfully"
          : "Create Product succesfully",
      };
};

export const deletedProductAction = async (
  _prev: InitialFormState,
  FormData: FormData
) => {
  const id = FormData.get("product-id") as string;

  const result = await removeProduct(id);

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "Product deleted successfully",
      };
};
export const restoreProductAction = async (
  _prev: InitialFormState,
  FormData: FormData
) => {
  const id = FormData.get("product-id") as string;

  const result = await reStoreProduct(id);

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "Product restore successfully",
      };
};

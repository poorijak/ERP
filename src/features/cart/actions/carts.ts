"use server";

import {
  addToCart,
  clearCart,
  removeFormCart,
  updateCartItem,
} from "../db/carts";

export const addToCartAction = async (formData: FormData) => {
  const data = {
    productId: formData.get("product-id") as string,
    count: parseInt(formData.get("product-count") as string) || 1,
  };

  const result = await addToCart(data);

  if (result && result.message) {
    return {
      success: false,
      message: result.message,
    };
  } else {
    return {
      success: true,
      message: "เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว",
    };
  }
};

export const updateToCartAction = async (formData: FormData) => {
  const data = {
    cartItemId: formData.get("cart-item-id") as string,
    newCount: parseInt(formData.get("product-count") as string),
  };

  const result = await updateCartItem(data);

  if (result && result.message) {
    return {
      success: false,
      message: result.message,
    };
  }
};

export const removeFromCartAction = async (CartItemId: string) => {
  const result = await removeFormCart(CartItemId);

  if (result && result.message) {
    return {
      success: false,
      message: result.message,
    };
  }
};

export const clearCartAction = async () => {
  const result = await clearCart();

  if (result && result.message) {
    return {
      success: false,
      message: result.message,
    };
  } else {
    return {
      success : true,
      message : "ล้างตะกร้าสำเร็จ"
    }
  }
};

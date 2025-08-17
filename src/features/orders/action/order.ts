"use server";

import { redirect } from "next/navigation";
import {
  cancelOrderStatus,
  createOrder,
  updateOrderStatus,
  uploadPaymentSlip,
} from "../db/orders";
import { InitialFormState } from "@/types/action";
import { OrderStatus } from "@prisma/client";

export const checkoutFormAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const data = {
    address: formData.get("address") as string,
    phone: formData.get("phone") as string,
    note: formData.get("note") as string,
    useProfileData: formData.get("use-profile-data") as string,
    addressId : formData.get("address-id") as string,
  };


  const result = await createOrder(data);

  if (result && result.message && !result.orderId) {
    return {
      success: false,
      message: result.message,
      errors: result.error,
    };
  }

  redirect(`/my-orders/${result.orderId}`);
};

export const uploadPaymentAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const orderId = formData.get("order-id") as string;
  const paymentImgae = formData.get("payment-image") as File;

  const result = await uploadPaymentSlip(orderId, paymentImgae);

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "อัพโหลดหลักฐานการชำระเงินสำเร็จ",
      };
};

export const cancelOrderAction = async (
  _prevState: InitialFormState,
  FormData: FormData,
) => {
  const orderId = FormData.get("order-id") as string;

  const result = await cancelOrderStatus(orderId);

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "ยกเลิกคำสั่งซื้อสำเร็จ",
      };
};

export const updateOrderStatusAction = async (FormData: FormData) => {
  const data = {
    orderId: FormData.get("order-id") as string,
    status: FormData.get("order-status") as OrderStatus,
    trackingNumber: FormData.get("tracking-number") as string,
  };

  console.log(data);

  const result = await updateOrderStatus(data);

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "เปลี่ยนแปลงสถานะสำเร็จ",
      };
};

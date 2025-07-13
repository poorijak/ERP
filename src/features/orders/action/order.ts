"use server";

import { redirect } from "next/navigation";
import { createOrder, uploadPaymentSlip } from "../db/orders";
import { InitialFormState } from "@/types/action";

export const checkoutFormAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const data = {
    address: formData.get("address") as string,
    phone: formData.get("phone") as string,
    note: formData.get("note") as string,
    useProfileData: formData.get("use-profile-data") as string,
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
  // _prevState: InitialFormState
  formData: FormData
) => {
  const orderId = formData.get("order-id") as string;
  const paymentImgae = formData.get("payment-image") as File;

  const result = await uploadPaymentSlip(orderId, paymentImgae);
};

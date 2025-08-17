"use server";

import { InitialFormState } from "@/types/action";
import { createAddress, updateAddress } from "../db/address";

export const AddressAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const data = {
    addressId: formData.get("address-id") as string,
    addressLine1: formData.get("address-line-1") as string,
    addressLine2: formData.get("address-line-2") as string,
    street: formData.get("street") as string,
    subdistrict: formData.get("subdistrict") as string,
    district: formData.get("district") as string,
    province: formData.get("province") as string,
    postalCode: formData.get("postalCode") as string,
    isMainAddress: formData.get("main-address") as string,
  };

  console.log(data);

  const result = data.addressId
    ? await updateAddress(data)
    : await createAddress(data);

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: data.addressId ? "แก้ไขที่อยู่สำเร็จ!" : "เพิ่มที่อยู่สำเร็จ",
      };
};

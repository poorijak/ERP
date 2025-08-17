import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getAddressGlobalTag = () => {
  return getGlobalTag("address");
};

export const getUserAddressTag = (userId: string) => {
  return `user:${userId}:address` as const;
};

export const getAddressIdTag = (addressId: string) => {
  return getIdTag("address", addressId);
};

export const revalidateAddressCache = (addressId: string, userId: string) => {
  revalidateTag(getAddressIdTag(addressId));
  revalidateTag(getAddressGlobalTag());
  revalidateTag(getUserAddressTag(userId));
};

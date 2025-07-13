import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

// รี cache ทั้งหมด
export const getOrderGlobalTag = () => {
  return getGlobalTag("orders");
};

// รีแค่ order นั้น
export const getOrderIdTag = (orderId: string) => {
  return getIdTag("orders", orderId);
};

// re cache ของ order เฉพาของ user นั้นคน
export const getUserOrderTag = (userId: string) => {
  return `user:${userId}:orders` as const;
};

export const revalidateOrderCache = (orderId: string, userId: string) => {
  revalidateTag(getOrderGlobalTag());
  revalidateTag(getOrderIdTag(orderId));
  revalidateTag(getUserOrderTag(userId));
};

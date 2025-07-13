import { UserType } from "@/types/user";

export const canCreateOrder = (user: UserType) => {
  return user.status === "Active";
};

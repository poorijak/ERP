import { UserType } from "@/types/user";

export const canCreateOrder = (user: UserType) => {
  return user.status === "Active";
};

export const canCancelOrder = (user: UserType) => {
  return user.status === "Active";
};

export const CanUpdateStatus = (user: UserType) => {
  return user.role === "Admin";
};

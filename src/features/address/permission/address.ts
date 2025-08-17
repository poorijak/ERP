import { UserType } from "@/types/user";

export const canCreateAddress = (user: UserType) => {
  return user.status === "Active";
};

export const canUpdateAddress = (user: UserType) => {
  return user.status === "Active";
};

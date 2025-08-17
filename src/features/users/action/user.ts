"use server";

import { InitialFormState } from "@/types/action";
import {
  udpadaetUserStatus,
  updateUserProfile,
  updateUserRole,
} from "../db/users";
import { UserRole, UserStatus } from "@prisma/client";

export const updateUserAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const data = {
    userId: formData.get("user-id") as string,
    name: formData.get("name") as string,
    profileImage: formData.get("profile-image") as File,
    tel: formData.get("tel") as string,
  };

  const result = await updateUserProfile(data);

  return result && result.message
    ? { success: false, message: result.message }
    : { success: true, message: "แก้ไขข้อมูลสำเร็จ" };
};

export const updateUserRoleAction = async (
  _prev: InitialFormState,
  formData: FormData,
) => {
  const data = {
    userId: formData.get("user-id") as string,
    userRole: formData.get("user-role") as UserRole,
  };

  const result = await updateUserRole(data);

  return result && result.message
    ? { success: false, message: result.message }
    : { success: true, message: "อัพเดตบทบาทสำเร็จ" };
};

export const udpateUserStatusAction = async (
  _prev: InitialFormState,
  formData: FormData,
) => {
  const data = {
    userId: formData.get("user-id") as string,
    userStatus: formData.get("user-status") as UserStatus,
  };

  const result = await udpadaetUserStatus(data);

  return result && result.message
    ? { success: false, message: result.message }
    : { success: true, message: "แก้ไขข้อมูลสำเร็จ" };
};

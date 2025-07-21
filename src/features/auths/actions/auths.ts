"use server";

import { InitialFormState } from "@/types/action";
import {
  signup,
  signin,
  signout,
  sentResetPasswordEmail,
  resetPassword,
} from "@/features/auths/db/auths";

export const authAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = rawData.confirmPassword
    ? await signup(rawData)
    : await signin(rawData);

  return result && result.message
    ? {
        success: false,
        message: result.message,
        errors: result.error,
      }
    : {
        success: true,
        message: rawData.confirmPassword
          ? "สมัครสมาชิกสำเร็จ"
          : "เข้าสู่ระบบสำเร็จ",
      };
};

export const signoutAction = async () => {
  const result = await signout();
  return result && result.message
    ? { success: false, message: result.message }
    : { success: true, message: "ออกจากระบบสำเร็จ" };
};

export const forgotPasswordAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const email = formData.get("email") as string;

  const result = await sentResetPasswordEmail(email);

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "เราได้ส่งอีเมลเพื่อไปกู้คืนรหัสผ่านแล้ว โปรดเช็คดูกล่องข้อความในอีเมลของคุณ",
      };
};

export const resetPasswordAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const data = {
    token: formData.get("token") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirm-password") as string,
  };

  const result = await resetPassword(data);

  return result && result.message
    ? { success: false, message: result.message }
    : { success: true, message: "เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบอีกครั้ง" };
};

"use client"

import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import { CardContent, CardFooter } from "@/components/ui/card";
import Form from "next/form";
import React from "react";
import { resetPasswordAction } from "../actions/auths";
import { useForm } from "@/hooks/use-form";

interface ResetPasswordProp {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordProp) => {
  const { formAction, isPending } = useForm(
    resetPasswordAction,
    "/auth/signin",
  );

  return (
    <Form action={formAction}>
      <CardContent className="flex flex-col gap-4">
        <input type="hidden" name="token" value={token} />

        <div>
          <InputForm
            label="รหัสผ่านใหม่"
            id="password"
            type="password"
            required
          />
        </div>
        <div>
          <InputForm
            label="ยืนยันรหัสผ่าน"
            id="confirm-password"
            type="password"
            required
          />
        </div>
      </CardContent>
      <CardFooter className="pt-6">
        <SubmitBtn
          className="w-full"
          name="เปลี่ยนรหัสผ่าน"
          disabled={isPending}
        />
      </CardFooter>
    </Form>
  );
};

export default ResetPasswordForm;

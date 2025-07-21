"use client"
import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import { CardContent, CardFooter } from "@/components/ui/card";
import Form from "next/form";
import React from "react";
import { forgotPasswordAction } from "../actions/auths";
import { useForm } from "@/hooks/use-form";

const ForgotPasswordForm = () => {
  const { formAction , isPending } = useForm(forgotPasswordAction , "/auth/signin");

  return (
    <Form action={formAction}>
      <CardContent>
        <InputForm
          label="อีเมลล์"
          id="email"
          type="email"
          required
          placeholder="กรอกอีเมลล์ของคุณ"
        />
      </CardContent>
      <CardFooter className="p-6">
        <SubmitBtn
          name="ส่งลิงค์เพื่อรีเซ็ตรหัสผ่าน"
          className="w-full"
          disabled={isPending}
        />
      </CardFooter>
    </Form>
  );
};

export default ForgotPasswordForm;

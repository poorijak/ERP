import AuthHeader from "@/features/auths/components/auth-header";
import ResetPasswordForm from "@/features/auths/components/reset-password-form";
import { redirect } from "next/navigation";
import React from "react";

interface ResetPassword {
  searchParams: Promise<{ token: string }>;
}

const page = async ({ searchParams }: ResetPassword) => {
  const { token } = await searchParams;

  if (!token) {
    redirect("/auth/signin");
  }

  return (
    <AuthHeader type="reset-password">
      <ResetPasswordForm token={token} />
    </AuthHeader>
  );
};

export default page;

import AuthHeader from "@/features/auths/components/auth-header";
import ForgotPasswordForm from "@/features/auths/components/forgot-password-form";
import React from "react";

const ForgotPassword = () => {
  return (
    <AuthHeader type="forgot-password">
      <ForgotPasswordForm />
    </AuthHeader>
  );
};

export default ForgotPassword;

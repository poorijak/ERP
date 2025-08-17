import AccountSidebar from "@/features/users/components/customer/desktop/account-destktop-sidebar";
import React from "react";

interface AccountLayout {
  children: React.ReactNode;
}

const AccountLayout = ({ children }: AccountLayout) => {
  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="flex">
        <div>
          <AccountSidebar />
        </div>
        <div className="w-5xl px-4 py-6">{children}</div>
      </div>
    </div>
  );
};

export default AccountLayout;

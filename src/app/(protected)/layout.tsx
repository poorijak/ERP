import HeaderCustomer from "@/components/customer-page/headers/layout/header";
import { authCheck } from "@/features/auths/db/auths";
import { redirect } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: MainLayoutProps) => {
  const user = await authCheck();

  if (!user || user.status !== "Active") {
    redirect("/auth/signin");
  }

  return (
    <div className="flex flex-col">
      <HeaderCustomer user={user} />
      {/* <AccountSidebar /> */}
      <main className="pt-16">{children}</main>
    </div>
  );
};
export default ProtectedLayout;

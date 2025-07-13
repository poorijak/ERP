import { UserType } from "@/types/user";
import MobileMenu from "@/components/customer-page/headers/menu/mobile-menu";
import CartIcon from "@/components/customer-page/headers/components/cart-icon";
import { DesktopNavLinks } from "@/components/customer-page/headers/components/navlinks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DesktopUserMenu from "@/components/customer-page/headers/menu/desktop-user-menu";
import { getCartItemCount } from "@/features/cart/db/carts";

interface NavbarProps {
  user: UserType | null;
}

const Navbar = async ({ user }: NavbarProps) => {
  const  itemCount = user ? await getCartItemCount(user.id) : 0;
  return (
    <nav className="flex items-center gap-3">
      {/* Mobile Navigation */}
      {user && <CartIcon itemCount={itemCount} />}
      <MobileMenu user={user} />

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center">
        <DesktopNavLinks />
        {user ? (
          <DesktopUserMenu  itemCount={itemCount} user={user} />
        ) : (
          <Button size="sm" asChild>
            <Link href="/auth/signin">เข้าสู่ระบบ</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};
export default Navbar;

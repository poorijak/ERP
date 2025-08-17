import { UserType } from "@/types/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  SignoutButton,
  UserAvatarSmall,
  UserDropdownAvatar,
} from "../components/user-comp";

interface DesktopUserMenuProps {
  user: UserType;
  itemCount: number;
}

const DesktopUserMenu = ({ user, itemCount }: DesktopUserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 rounded-full">
          <UserAvatarSmall user={user} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={4} // px
        className="w-56"
      >
        <DropdownMenuLabel className="flex flex-col items-center gap-2">
          <UserDropdownAvatar user={user} />
          <span>สวัสดี, {user.name || user.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/account">โปรไฟล์ของฉัน</Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/cart" className="flex items-center justify-center">
            <span>ตะกร้าของฉัน</span>
            <Badge className="ml-auto">{itemCount >= 99 ? "99+" : itemCount}</Badge>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/my-orders">ประวัติการสั่งซื้อ</Link>
        </DropdownMenuItem>

        {user.role === "Admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/admin">หลังบ้าน</Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <div>
          <SignoutButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default DesktopUserMenu;

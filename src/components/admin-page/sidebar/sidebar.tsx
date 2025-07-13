"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/SidebarProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  X,
} from "lucide-react";
import { UserType } from "@/types/user";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SidebarLink from "./sidebar-link";
import { usePathname } from "next/navigation";
import { useSignout } from "@/hooks/use-sign-out";

interface SidebarAdminProps {
  user: UserType;
}

const SidebarAdmin = ({ user }: SidebarAdminProps) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { isPending, handleSignout } = useSignout();
  const pathname = usePathname();

  const sidebarLinks = [
    {
      href: "/admin",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      href: "/admin/categories",
      icon: <FolderTree size={20} />,
      label: "Categories",
    },
    {
      href: "/admin/products",
      icon: <ShoppingCart size={20} />,
      label: "Products",
    },
  ];

  return (
    <div>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/70 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-svh bg-card w-64 border-r border-border flex flex-col transition-all duration-200",
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <div className="size-6 text-primary-foreground font-bold flex items-center justify-center">
                A
              </div>
            </div>
            <span className="text-xl font-bold">Admin</span>
          </Link>
          {/* Toggle Sidebar Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-[calc(100vw-128px)] overflow-y-auto">
          <ScrollArea className="flex-1">
            <div className="p-4">
              {/* Profile Box */}
              <div className="mb-6 flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="size-10">
                  <AvatarImage
                    src={user.picture || undefined}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              {/* Menu */}
              <nav className="space-y-1.5">
                {sidebarLinks.map((link, index) => (
                  <SidebarLink
                    key={index}
                    href={link.href}
                    icon={link.icon}
                    label={link.label}
                    isActive={pathname === link.href}
                    onClose={toggleSidebar}
                  />
                ))}
              </nav>
            </div>
          </ScrollArea>
        </div>

        {/* Signout Button */}
        <div className="border-t border-border p-4 mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground cursor-pointer"
            disabled={isPending}
            onClick={handleSignout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </div>
  );
};
export default SidebarAdmin;

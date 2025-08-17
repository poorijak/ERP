"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { House, Lock, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const menu_list = [
  { label: "โปรไฟล์ของฉัน", icon: <User />, href: "/account" },
  { label: "ที่อยู่", icon: <House />, href: "/account/address" },
  { label: "ความปลอดภัย", icon: <Lock />, href: "/account/security" },
];

const AccountSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="h-full flex justify-start w-[250px]  px-6 py-8">
      <div className="flex flex-col gap-5">
        {menu_list.map((item, index) => (
          <Button
            key={index}
            variant={pathname === item.href ? "default" : "secondary"}
            className={cn(
              "flex items-center justify-start py-4",
              pathname !== item.href && "text-muted-foreground",
            )}
            asChild
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </div>
    </aside>
  );
};

export default AccountSidebar;

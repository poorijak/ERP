import { Button } from "@/components/ui/button";
import { Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border border-primary rounded-md">
      <div className="bg-muted p-6 rounded-full mb-6">
        <ShoppingBag size={64} />
      </div>
      <h2 className="text-xl font-semibold mb-2">ตะกร้าของคุณว่างเปล่า</h2>

      <p className="text-muted-foreground text-center max-w-md mb-6">
        ดูเหมือนว่าคุณยังไม่ได้เพิ่มสินค้าลงตะกร้า
        เริ่มช็อปปิ้งเพื่อค้นหาสินค้าที่น่าสนใจ
      </p>
      <Button asChild>
        <Link href="/products" className="flex items-center justify-center">
          <Search size={16} />
          <span>ค้นหาสินค้า</span>
        </Link>
      </Button>
    </div>
  );
};

export default EmptyCart;

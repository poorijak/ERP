"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/formatPrice";
import { CartType } from "@/types/cart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React, { useOptimistic, useTransition } from "react";
import { clearCartAction } from "../actions/carts";
import { toast } from "sonner";

interface CartSummaryProps {
  cart: CartType;
}

const CartSummary = ({ cart }: CartSummaryProps) => {
  const [isPending, startTransition] = useTransition();

  const [opCart, updateOpCart] = useOptimistic(
    cart,
    (state, action: "clear") => {
      if (action === "clear") {
        return {
          ...state,
          items: [],
          cardTotal: 0,
          itemCount: 0,
        };
      }

      return state;
    }
  );

  const handleClearCart = async () => {
    startTransition(async () => {
      updateOpCart("clear");
    });
    const result = await clearCartAction();

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">สรุปการสั่งซื้อ</h2>

      <div className="flex items-center justify-between">
        <span>ยอดรวม</span>
        <span>{formatPrice(opCart.cardTotal)}</span>
      </div>

      <div className="flex justify-between text-muted-foreground">
        <span>ค่าจัดส่ง</span>
        <span>ฟรี</span>
      </div>

      <Separator />

      <div className="flex justify-between font-semibold text-lg">
        <span>ทั้งหมด</span>
        <span>{formatPrice(opCart.cardTotal)}</span>
      </div>

      <div className="pt-2 space-y-2">
        <Button className="w-full" asChild>
          <Link href='/checkout' className=" flex gap-2 items-center">
            <ShoppingBag size={14} />
            <span>เช็คเอาท์</span>
          </Link>
        </Button>
        <Button
          className="w-full"
          variant={"outline"}
          disabled={opCart.items.length === 0 || isPending}
          onClick={handleClearCart}
        >
          ล้างตะกร้า
        </Button>
      </div>
    </Card>
  );
};

export default CartSummary;

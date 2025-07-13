"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import { CartType } from "@/types/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useOptimistic, useTransition } from "react";
import { removeFromCartAction, updateToCartAction } from "../actions/carts";
import { toast } from "sonner";

interface CartItemsProps {
  cart: CartType;
}

interface cartOptimistic {
  type: "update" | "remove";
  itemId: string;
  newCount?: number; // ? เพราะ remove ไม่มี count ใหม่เพราะเป็นการ ลบ
}

const CartItem = ({ cart }: CartItemsProps) => {
  //eslint-disable-next-line
  const [isPending, startTransition] = useTransition();

  const [opCart, updateOpCart] = useOptimistic(
    cart,
    (state, { type, itemId, newCount }: cartOptimistic) => {
      if (type === "update" && newCount !== undefined) {
        const updatedItems = state.items.map((item) => {
          if (item.id === itemId) {
            const newPrice = newCount * item.product.price;

            return {
              ...item,
              count: newCount,
              price: newPrice,
            };
          }

          return item; // ถ้า item.id ที่ map มา มันไม่ตรงกับ itemId จาก onClick จะทำการ return item ตอนแรกกลับมาและแจ้ง error  เหมือน roll back และ function ข้างใน if จะไม่ทำงาน
        });

        // หาราคารวมทั้งตะกร้า
        const newTotal = updatedItems.reduce(
          (total, item) => total + item.price,
          0
        );

        // หาจำนวนสินค้ารวม
        const newItemCount = updatedItems.reduce(
          (total, item) => total + item.count,
          0
        );

        return {
          ...state,
          items: updatedItems,
          cardTotal: newTotal,
          itemCount: newItemCount,
        };
      }

      if (type === "remove") {
        const updateItems = state.items.filter((item) => item.id !== itemId);

        const newTotal = updateItems.reduce(
          (total, item) => total + item.price,
          0
        );

        const newItemCount = updateItems.reduce(
          (total, item) => total + item.price,
          0
        );

        return {
          ...state,
          items: updateItems,
          cardTotal: newTotal,
          itemCount: newItemCount,
        };
      }
      return state;
    }
  );

  const handleUpdateCart = async (itemId: string, newCount: number) => {
    // ถ้าใช้ useOptimistic ต้องครอบด้วย useTransition ตลอด เพราะเป็นการเปลี่ยนแปลง ui
    startTransition(() => {
      updateOpCart({ type: "update", itemId, newCount });
    });

    const formData = new FormData();
    formData.append("cart-item-id", itemId);
    formData.append("product-count", newCount.toString());

    const result = await updateToCartAction(formData);

    if (!result) return null;

    if (result && result.message) {
      toast.error(result.message);
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    startTransition(() => {
      updateOpCart({ type: "remove", itemId });
    });

    const result = await removeFromCartAction(itemId);

    if (result && result.message) {
      toast.error(result.message);
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">รายการในตะกร้า</h2>

      {opCart.items.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-4 pb-4">
          <div className="relative size-24 border border-primary rounded-md overflow-hidden">
            <Link href={`/products/${item.product.id}`}>
              <Image
                alt={item.product.title}
                src={
                  item.product.mainImage?.url || "/images/no-product-image.webp"
                }
                fill
                className="object-cover"
              />
            </Link>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex justify-between">
              <Link
                className="text-lg font-medium hover:text-primary transition-colors"
                href={`/product/${item.product.id}`}
              >
                {item.product.title}
              </Link>
              <p className="font-semibold">{formatPrice(item.price)}</p>
            </div>

            <div className="text-sm text-muted-foreground">
              ประเภท : {item.product.category.name}
            </div>
            <div className="text-sm text-muted-foreground">
              ราคาต่อหน่วย : {formatPrice(item.product.price)}
            </div>

            {/* Button */}
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <Button
                  variant={"outline"}
                  className="size-8"
                  disabled={item.count <= 1}
                  onClick={() => handleUpdateCart(item.id, item.count - 1)}
                >
                  <Minus size={14} />
                </Button>

                <span className="w-10 text-center">{item.count}</span>

                <Button
                  variant={"outline"}
                  className="size-8"
                  disabled={item.count >= item.product.stock}
                  onClick={() => handleUpdateCart(item.id, item.count + 1)}
                >
                  <Plus size={14} />
                </Button>
              </div>

              <Button
                variant={"ghost"}
                size={"icon"}
                className="text-destructive/90 hover:text-destructive"
                onClick={() => handleRemoveFromCart(item.id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default CartItem;

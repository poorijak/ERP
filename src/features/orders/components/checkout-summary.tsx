import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format/formatPrice";
import { CartType } from "@/types/cart";
import Image from "next/image";
import React from "react";

interface CheckoutSummaryProps {
  cart: CartType;
}

const CheckoutSummary = ({ cart }: CheckoutSummaryProps) => {
  const shippingFee = 50;

  const totalAmount = cart.cardTotal * 50;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">สรุปรายการสั่งซื้อ</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {cart.items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="relative aspect-square size-12 border rounded-md overflow-hidden">
                <Image
                  alt={item.product.title}
                  src={
                    item.product.mainImage?.url ||
                    "/images/no-product-image.webp"
                  }
                  fill
                />
              </div>

              <div className="flex-1/2 text-sm">
                <div className="font-medium line-clamp-1">
                  {item.product.title}
                </div>
                {/* count จำนวนที่กดมา */}
                <div className="text-muted-foreground">
                  {item.count} x {formatPrice(item.product.price)}
                </div>
              </div>
              {/* price ราคารวมของที่กดมาต่อ cartItem ชิ้นนั้น */}
              <div className="font-medium">{formatPrice(item.price)}</div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span>ยอดรวมสินค้า</span>
            <span>{formatPrice(cart.cardTotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>ค่าจัดส่ง</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>รวมทั้งสิ้น</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
        </div>

        <Separator />
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;

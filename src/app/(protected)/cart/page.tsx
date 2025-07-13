import CartItem from "@/features/cart/components/cart-items";
import CartSummary from "@/features/cart/components/cart-summary";
import EmptyCart from "@/features/cart/components/empty-cart";
import { getUserCart } from "@/features/cart/db/carts";
import { headers } from "next/headers";
import React from "react";

const CartPage = async () => {
  const head = await headers();
  const userId = head.get("x-user-id");
  const cart = await getUserCart(userId);

  return (
    <div className="contrainer mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ตะกร้าของฉัน</h1>

      {!cart || cart.items.length === 0 ? (
        <EmptyCart /> // ไม่ต้องมี if (!cart) แล้ว เพราะว่าเราทำการเช็ค cart จากตรงนี้แล้ว ยังไง null ก็จะไม่ผ่านไป
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div>
              <CartItem cart={cart} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <CartSummary cart={cart} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

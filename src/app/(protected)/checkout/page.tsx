import { getAddressByUserId } from "@/features/address/db/address";
import { authCheck } from "@/features/auths/db/auths";
import { getUserCart } from "@/features/cart/db/carts";
import CheckoutSummary from "@/features/orders/components/checkout-summary";
import CheckoutForm from "@/features/orders/components/checkout_form";
import { redirect } from "next/navigation";
import React from "react";

const checkoutPage = async () => {
  const user = await authCheck();

  if (!user) {
    redirect("/auth/signin");
  }

  const cart = await getUserCart(user.id);
  const address = await getAddressByUserId(user.id);

  if (!cart || cart.cartItems.length === 0) {
    redirect("/cart");
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">ชำระเงิน</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm user={user} address={address} />
        </div>
        <div className="lg:col-span-1">
          <CheckoutSummary cart={cart} />
        </div>
      </div>
    </div>
  );
};

export default checkoutPage;

import { Button } from "@/components/ui/button";
import { authCheck } from "@/features/auths/db/auths";
import OrderDetail from "@/features/orders/components/my-order/order-detail";
import { getOrderById } from "@/features/orders/db/orders";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface OrderDatailPageProps {
  params: Promise<{ id: string }>; // id อิงตาม dynamic Folder [id]
}

const page = async ({ params }: OrderDatailPageProps) => {
  const user = await authCheck();

  if (!user) {
    redirect("/auth/signin");
  }

  const { id } = await params;

  const order = await getOrderById(user.id, id);

  if (!order) {
    redirect("/my-orders")
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">รายละเอียดคำสั่งซื้อ</h1>
        <Button variant={"outline"} asChild>
          <Link href="/my-orders">
            <ArrowLeft size={16} />
            <span>กลับไปหน้ารายการสั่งซื้อ</span>
          </Link>
        </Button>
      </div>

      <OrderDetail order={order} />
    </div>
  );
};

export default page;

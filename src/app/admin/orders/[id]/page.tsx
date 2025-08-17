import { Button } from "@/components/ui/button";
import { authCheck } from "@/features/auths/db/auths";
import AdminOrderDetail from "@/features/orders/components/admin-orders/admin-order-detail";
import { getOrderById } from "@/features/orders/db/orders";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface adminOrdersProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: adminOrdersProps) => {
  const user = await authCheck();

  if (!user || user.role !== "Admin") {
    redirect("/");
  }

  const { id } = await params;
  const order = await getOrderById(user.id, id);

  if (!order) {
    redirect("/admin/orders");
  }

  return (
    <div className="flex-col flex gap-6 p-4 sm:p-6">
      <div className="flex w-full flex-col items-start justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold md:text-2xl">Ordre # {id}</h1>
          <p className="text-muted-foreground text-sm">
            Create on {order.createdAtFomatted}
          </p>
        </div>

        <Button asChild variant={"outline"}>
          <Link href={"/admin/orders"} className="flex gap-2">
            <ArrowLeft size={16} />
            <span>Back to order</span>
          </Link>
        </Button>
      </div>


      <AdminOrderDetail order={order}/>
    </div>
  );
};

export default page;

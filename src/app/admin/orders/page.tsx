import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authCheck } from "@/features/auths/db/auths";
import AdminOrderList from "@/features/orders/components/admin-orders/admin-order-list";
import { getAllOrder } from "@/features/orders/db/orders";
import { OrderStatus } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface AdminOrderPageProps {
  //  Promise Status ตั้ง type เป็นตาม ?status=delivered ? เพราะ all ไม่มี searchParams
  searchParams: Promise<{ status?: string; page?: string }>;
}

const page = async ({ searchParams }: AdminOrderPageProps) => {
  const user = await authCheck();

  if (!user || user.role !== "Admin") {
    redirect("/");
  }

  const status = (await searchParams).status as OrderStatus; // as OrderStatus เพื่อ fixed type
  
  console.log(status);
  
  const page = parseInt((await searchParams).page || "1");
  const limit = 2;

  const { totalCount, orders } = await getAllOrder(page, limit, status);

  const pendinCount = orders.filter(
    (order) => order.status === "Pending",
  ).length;
  const paidCount = orders.filter((order) => order.status === "Paid").length;
  const shippedCount = orders.filter(
    (order) => order.status === "Shipped",
  ).length;
  const cancelledCount = orders.filter(
    (order) => order.status === "Cancelled",
  ).length;
  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

  const filerStauts = [
    { title: "All", href: "/admin/orders" },
    { title: "Pending", href: "/admin/orders?status=Pending" },
    { title: "Paid", href: "/admin/orders?status=Paid" },
    { title: "Shipped", href: "/admin/orders?status=Shipped" },
    { title: "Delivered", href: "/admin/orders?status=Delivered" },
    { title: "Cancelled", href: "/admin/orders?status=Cancelled" },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col items-start justify-between gap-4 border-b py-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold sm:text-3xl">Order Management</h1>
          <p className="text-muted-foreground text-sm">
            view and manage customer orders
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="px-2 py-1 sm:px-3">
            <span className="font-medium text-blue-600">{orders.length}</span>
            Total
          </Badge>
          <Badge variant="outline" className="px-2 py-1 sm:px-3">
            <span className="font-medium text-yellow-600">{pendinCount}</span>
            Pending
          </Badge>
          <Badge variant="outline" className="px-2 py-1 sm:px-3">
            <span className="font-medium text-blue-500">{paidCount}</span>Paid
          </Badge>
          <Badge variant="outline" className="px-2 py-1 sm:px-3">
            <span className="font-medium text-indigo-500">{shippedCount}</span>
            Shipped
          </Badge>
          <Badge variant="outline" className="px-2 py-1 sm:px-3">
            <span className="font-medium text-green-600">{deliveredCount}</span>
            Delivered
          </Badge>
          <Badge variant="outline" className="px-2 py-1 sm:px-3">
            <span className="font-medium text-red-600">{cancelledCount}</span>
            Cancelled
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-lg">Ordres</CardTitle>
          {/* defaultValue ถ้า มี status ก็จเป็น status ที่เลือก */}
          <Tabs defaultValue={status || "all"}>
            <TabsList className="grid grid-cols-6">
              {filerStauts.map((item, index) => (
                <TabsTrigger key={index} value={item.title}>
                  <Link href={item.href}>{item.title}</Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          <AdminOrderList
            orders={orders}
            page={page}
            totalCount={totalCount}
            limit={limit}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;

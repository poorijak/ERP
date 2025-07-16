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
  searchParams : Promise<{ status? : string}>
}

const page = async ({ searchParams } : AdminOrderPageProps) => {
  const user = await authCheck();

  if (!user || user.role !== "Admin") {
    redirect("/");
  }

  const status = (await searchParams).status as OrderStatus // as OrderStatus เพื่อ fixec type

  const orders = await getAllOrder(user.id  , status);

  const pendinCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;
  const paidCount = orders.filter((order) => order.status === "Paid").length;
  const shippedCount = orders.filter(
    (order) => order.status === "Shipped"
  ).length;
  const cancelledCount = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;
  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground text-sm">
            view and manage customer orders
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="px-2 sm:px-3 py-1">
            <span className="font-medium text-blue-600">{orders.length}</span>
            Total
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1">
            <span className="font-medium text-yellow-600">{pendinCount}</span>
            Pending
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1">
            <span className="font-medium text-blue-500">{paidCount}</span>Paid
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1">
            <span className="font-medium text-indigo-500">{shippedCount}</span>
            Shipped
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1">
            <span className="font-medium text-green-600">{deliveredCount}</span>
            Delivered
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1">
            <span className="font-medium text-red-600">{cancelledCount}</span>
            Cancelled
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-lg">Ordres</CardTitle>
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-6">
            <TabsTrigger value="all" asChild>
              <Link href="/admin/orders">All</Link>
            </TabsTrigger>
            <TabsTrigger value="Pending" asChild>
              <Link href="/admin/orders?status=shipped">Pending</Link>
            </TabsTrigger>
            <TabsTrigger value="Paid" asChild>
              <Link href="/admin/orders?status=padi">Paid</Link>
            </TabsTrigger>
            <TabsTrigger value="Shipped" asChild>
              <Link href="/admin/orders?status=shipped">Shipped</Link>
            </TabsTrigger>
            <TabsTrigger value="Delivered" asChild>
              <Link href="/admin/orders?status=delivered">Delivered</Link>
            </TabsTrigger>
            <TabsTrigger value="Cancelled">
              <Link href="/admin/orders?status=cancelled">Cancelled</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        </CardHeader>

      <CardContent>
        <AdminOrderList orders={orders}/>
      </CardContent>
      </Card>
    </div>
  );
};

export default page;

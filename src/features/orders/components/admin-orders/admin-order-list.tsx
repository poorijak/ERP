"use client";
import Paginaiton from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusColor } from "@/lib/utils";
import { OrderType } from "@/types/order";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface AdminOrderList {
  orders: OrderType[]; // เป็น [] เพราะ findMany มาแล้วจะมาแสดงหลาตัว
  page: number;
  totalCount: number;
  limit: number;
}

const AdminOrderList = ({
  orders,
  page,
  totalCount,
  limit,
}: AdminOrderList) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const totalPage = Math.ceil(totalCount / limit);

  const onPageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  className="text-muted-foreground py-6 text-center"
                  colSpan={7}
                >
                  No Orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell className="line-clamp-1">
                    {order.customer.name || order.customer.email}
                  </TableCell>
                  <TableCell>{order.createdAtFomatted}</TableCell>
                  <TableCell>{order.totalItems} items</TableCell>
                  <TableCell>{order.totalAmount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size={"sm"} asChild variant={"outline"}>
                      <Link href={`/admin/orders/${order.id}`} className="flex">
                        <Eye size={14} />
                        <span className="font-normal">View</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <Paginaiton
          page={page}
          totalPage={totalPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default AdminOrderList;

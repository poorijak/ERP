"use client";
import Paginaiton from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format/formatDate";
import { getStatusColor } from "@/lib/utils";
import { OrderUserType } from "@/types/order";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface AdminUserOrderProp {
  order: OrderUserType;
  page: number;
  limit: number;
  searchParam?: { page: string };
}

const AdminUserOrder = ({ order, page, limit }: AdminUserOrderProp) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  console.log(order.totalSpend);
  const totalPage = Math.ceil(order.totalOrder / limit);


  const onPageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="text-xl">User Order</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Id</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderList.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.id}</TableCell>
                  <TableCell>{formatDate(o.createdAt)}</TableCell>
                  <TableCell>{o.items.length}</TableCell>
                  <TableCell>{o.totalAmount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(o.status)}>
                      {o.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" asChild>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="flex gap-1"
                      >
                        <Eye size={3} />
                        <span className="text-sm">View</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div>
            <Paginaiton
              page={page}
              totalPage={totalPage}
              onPageChange={onPageChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserOrder;

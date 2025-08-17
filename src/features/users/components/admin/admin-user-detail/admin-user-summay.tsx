import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/format/formatDate";
import { formatPrice } from "@/lib/format/formatPrice";
import { OrderUserType } from "@/types/order";
import React from "react";

interface AdminUserSummaryProps {
  order: OrderUserType;
}

const AdminUserSummary = ({ order }: AdminUserSummaryProps) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-xl">Spending Overview</h2>
          </CardTitle>
          <Separator />
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Spending</span>
              <span>{formatPrice(order.totalSpend)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Order</span>
              <span>{order.totalOrder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Order Amout</span>
              <span>{order.lastOrder?.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Order Date</span>
              <span>{formatDate(order.lastOrder?.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserSummary;

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format/formatPrice";
import { getStatusColor } from "@/lib/utils";
import { OrderType } from "@/types/order";
import { OrderStatus } from "@prisma/client";
import { Ban, Check, Truck } from "lucide-react";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import { updateOrderStatusAction } from "../../action/order";
import { toast } from "sonner";

interface AdminOrderDetail {
  order: OrderType;
}

const AdminOrderDetail = ({ order }: AdminOrderDetail) => {
  // เก็บค่าของ select comp บังคับเป็น ordreStatus
  const [selectStatus, setSelectStatus] = useState<OrderStatus>(order.status);
  // เก็บ value ของ tracking Number
  const [trackingNubmer, setTrackingNumber] = useState(
    order.trackingNumber || "",
  );

  const [isPending, startTransition] = useTransition();

  // เราทำการส่งแค่ status กับ trackingNumber เรียกใช้ action ง่ายๆ แบบนี้เพราะส่งค่าน้อย
  const handleUpdateStatus = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("order-id", order.id);
      formData.append("order-status", selectStatus);

      if (trackingNubmer) {
        formData.append("tracking-number", trackingNubmer);
      }

      const result = await updateOrderStatusAction(formData);

      if (result.message) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* left content */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="border-b pb-2">
            <div className="flex justify-between gap-4 sm:flex-row sm:items-center">
              <CardTitle className="text-xl font-bold">Order Detail</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Quanity</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {order.items.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative aspect-square size-10 overflow-hidden rounded-sm border">
                          <Image
                            alt={order.productTitle}
                            src={
                              order.productImage ||
                              "/images/no-product-image.webp"
                            }
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p>{order.productTitle}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(order.price)}
                    </TableCell>
                    <TableCell className="text-center">
                      {order.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(order.totalPrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Infomation</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <div>
                <Label className="text-muted-foreground text-sm">Name</Label>
                <p className="font-medium">
                  {order.customer.name || "Not provied"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Email</Label>
                <p className="font-medium">{order.customer.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Phone</Label>
                <p className="font-medium">{order.phone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Infomation</CardTitle>
            </CardHeader>

            <CardContent>
              <div>
                <Label className="text-muted-foreground text-sm">Address</Label>
                <p className="font-medium">
                  {order.address?.fullAddress || "Not provided"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">
                  Trcking Number
                </Label>
                <p className="font-medium">
                  {order.trackingNumber || "Not provided"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Notes</Label>
                <p className="font-medium">{order.note || "Not provided"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* right content */}
      <div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>
                  {formatPrice(order.totalAmount - order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shopping Fee:</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-bold">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Update Order Status</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectStatus}
                  onValueChange={(value) =>
                    setSelectStatus(value as OrderStatus)
                  }
                  disabled={order.status === "Cancelled"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* แสดงตอนที่ selectStatus เป็น shipped หรือ Delivered */}
              {(selectStatus === "Shipped" || selectStatus === "Delivered") && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tracking">Tracking Number</Label>
                  <Input
                    id="Tracking"
                    placeholder="Enter tracking number"
                    value={trackingNubmer}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>
              )}
            </div>

            {order.paymentImage && (
              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-2">
                  Payment Proof
                  <Check color="green" strokeWidth={4} size={16} />
                </Label>
                <div className="relative aspect-square">
                  <Image alt="Payment-Proof" src={order.paymentImage} fill />
                </div>
              </div>
            )}

            {/* disable เมื่อค่าที่เลือก = status อยู่แล้ว เพระาจะแก้ไขอะไร หรือ เอา String ไปเปรียบเทียบ Sttring กับค่าที่เลือก และถ้ามี shipped หรือ Delivered ก็ต้องมีมีเลขพัสดุ ตามมาด้วย */}
            <Button
              onClick={handleUpdateStatus}
              disabled={
                selectStatus === order.status ||
                (["Shipped", "Delivered"].includes(selectStatus) &&
                  !trackingNubmer) ||
                isPending
              }
            >
              <>
                {selectStatus === "Shipped" && <Truck size={16} />}
                {selectStatus === "Delivered" && <Check size={16} />}
                {selectStatus === "Cancelled" && <Ban size={16} />}
              </>
              <span>Update Status</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrderDetail;

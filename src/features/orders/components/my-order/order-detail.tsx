"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { generatePromptPayQR } from "@/lib/generatePromptPayQR";
import { getStatusColor, getStatusText } from "@/lib/utils";
import { OrderType } from "@/types/order";
import { Ban, CreditCard, Upload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import PaymentFormModal from "../payment-form-modal";
import CancelModal from "../cancel-order-modal";

interface OrderDetailProps {
  order: OrderType;
}

const OrderDetail = ({ order }: OrderDetailProps) => {
  // Qrcode
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isGeneratingQr, setGeneratingQr] = useState(false);

  // modal
  const [isCancelModal, setIsCancalModal] = useState(false);
  const [isPaymentFormModal, setIsPaymentFormModal] = useState(false);

  const handleGenerateQr = () => {
    try {
      // เริ่ม gen Qr
      setGeneratingQr(true);
      const QrCode = generatePromptPayQR(order.totalAmount);
      setQrCodeUrl(QrCode);
    } catch (error) {
      console.error("Error handling generate Qr Code", error);
      toast.error("เกิดข้อผิดพลาดในการสร้าง QR Code");
    } finally {
      // ตอนจบเมื่อเราผ่าน try มาแล้ว ก็ set false
      setGeneratingQr(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="border-b pb-2">
            <CardTitle className="text-xl">
              หมายเลขคำสั่งซื้อ: {order.orderNumber}
            </CardTitle>
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
          </CardHeader>

          <CardContent className="p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>สินค้า</TableHead>
                  <TableHead className="text-right">ราคาต่อชิ้น</TableHead>
                  <TableHead className="text-center">จำนวน</TableHead>
                  <TableHead className="text-right">ราคารวม</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {order.items.map((orderItem, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 overflow-hidden rounded-md border">
                          <Image
                            alt={orderItem.productTitle}
                            src={
                              orderItem.productImage ||
                              "/images/no-product-image.webp"
                            }
                            className="object-cover"
                            fill
                          />
                        </div>
                        <span className="font-medium">
                          {orderItem.productTitle}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(orderItem.price)}
                    </TableCell>
                    <TableCell className="text-center">
                      {orderItem.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(orderItem.totalPrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>ข้อมูลการจัดส่ง</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="grid-col-1 grid gap-4 sm:grid-cols-3">
              <div>
                <h3 className="mb-1 font-medium">ที่อยู่จัดส่ง : </h3>
                <p className="text-muted-foreground">
                  {order.address.fullAddress}
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-medium">เบอร์โทรศัพท์ : </h3>
                <p className="text-muted-foreground">{order.phone || "-"}</p>
              </div>

              {/* เช็คว่า order นี้มี note มั้ย */}
              {order.note && (
                <div>
                  <h3>หมายเหตุ : </h3>
                  <p className="text-muted-foreground">{order.note}</p>
                </div>
              )}

              {order.trackingNumber && (
                <div>
                  <h3>หมายเลขพัสดุ : </h3>
                  <p className="text-muted-foreground">
                    {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">สรุปคำสั่งซื้อ</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ยอดสินค้า : </span>
                <span>
                  {formatPrice(order.totalAmount - order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ค่าจัดส่ง : </span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span className="text-muted-foreground">ยอดรวมทั้งสิ้น :</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            {/* จะทำงานเมื่อ status เป็น pending เท่านั้น */}
            {order.status === "Pending" && (
              <>
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex flex-col gap-2">
                    {qrCodeUrl ? ( // เมื่อเรากดเจน qr button ก็หายไปตาม เงื่อนไข แล้วก็ render รูป qrcode แทน
                      <div className="rounded-mb flex flex-col items-center border p-4">
                        <h3 className="font mb-3 text-center font-medium">
                          สแกน QR Code เพื่อชำระเงิน
                        </h3>
                        <div className="mb-3">
                          <Image
                            alt="Prompt QR Code"
                            src={qrCodeUrl}
                            width={200}
                            height={200}
                          />
                        </div>
                      </div>
                    ) : (
                      // เริ่มแรกมันจะ render button ก่อน เพราะว่าเราต้องกด gen qr ก่อน QrCodeUrl ถึงจะมีค่า
                      <Button
                        onClick={handleGenerateQr}
                        disabled={isGeneratingQr}
                      >
                        <CreditCard />
                        <span>
                          {isGeneratingQr
                            ? "กำลังสร้าง QR code ..."
                            : "ชำระเงินด้วย PromtPay"}
                        </span>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => setIsPaymentFormModal(true)}
                    >
                      <Upload size={16} />
                      <span>อัพโหลดหลักฐานการชำระเงิน</span>
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => setIsCancalModal(true)}
                    >
                      <Ban size={16} />
                      <span>ยกเลิกการสั่งซ์ื้อ</span>
                    </Button>

                    <PaymentFormModal
                      open={isPaymentFormModal}
                      onOpenChange={setIsPaymentFormModal}
                      orderId={order.id}
                    />

                    <CancelModal
                      open={isCancelModal}
                      onOpenChange={setIsCancalModal}
                      orderId={order.id}
                    />
                  </div>
                </div>
              </>
            )}

            {order.paymentImage && (
              <div className="flex flex-col gap-2 pt-2">
                <h3>หลักฐานการชำระเงิน :</h3>
                <div className="relative aspect-square w-full overflow-hidden rounded-md border">
                  <Image
                    alt="payment slip"
                    src={order.paymentImage}
                    fill
                    className="object-contain"
                  />
                </div>

                {order.paymentAt && (
                  <p className="text-muted-foreground text-sm">
                    ชำระเงินเมื่อ : <span>{order.paymentFormatted}</span>
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetail;

import InputForm from "@/components/shared/input-form";
import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload } from "lucide-react";
import Form from "next/form";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { uploadPaymentAction } from "../action/order";

interface PaymentFormModal {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
}

const PaymentFormModal = ({
  open,
  onOpenChange,
  orderId,
}: PaymentFormModal) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // 5mb
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ไฟล์ขนาดใหญ่เกินไป (ไม่เกิน 5 MB)");

      return
    }

    const url = URL.createObjectURL(file);

    setPreview(url);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="อัพโหลดหลักฐานการชำระเงิน"
      description=""
    >
      <Form action={uploadPaymentAction}>
        <input type="hidden" name="order-id" value={orderId} />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <InputForm
              label="รูปหลักฐานการชำระเงิน"
              id="payment-image"
              type="file"
              accept="image/*"
              required
              onChange={(e) => handleFileChange(e)}
            />
          </div>

          <ScrollArea className="max-h-[400px] sm:max-h-[480px]">
            {preview && (
              <div className="relative aspect-square w-full rounded-md overflow-hidden border">
                <Image
                  alt="Payment preview"
                  src={preview}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </ScrollArea>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setPreview(null);
                onOpenChange(false);
              }}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={!preview}>
              <Upload size={16} />
              <span>อัพโหลด</span>
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default PaymentFormModal;

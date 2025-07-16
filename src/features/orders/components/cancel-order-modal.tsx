import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/submit-btn";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import Form from "next/form";
import React from "react";
import { cancelOrderAction } from "../action/order";
import { useForm } from "@/hooks/use-form";

interface cancleModalProp {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
}

const CancelModal = ({ open, onOpenChange, orderId }: cancleModalProp) => {
  const { formAction, isPending } = useForm(cancelOrderAction);

  return (
    <Modal
      title="ยกเลิกคำสั่งซื้อ"
      description="คุณต้องการยกเลิกคำสั่งซื้อหรือไม่?"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form action={formAction}>
        <input type="hidden" name="order-id" value={orderId} />
        <div className="flex justify-end  gap-2">
          <Button variant={"outline"} disabled={isPending}>ยกเลิก</Button>
          <SubmitBtn
            name="ยกเลิกคำสั่งซื้อ"
            icon={Ban}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/80"
          />
        </div>
      </Form>
    </Modal>
  );
};

export default CancelModal;

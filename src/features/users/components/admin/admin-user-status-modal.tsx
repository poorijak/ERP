import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { BanIcon, Check } from "lucide-react";
import Form from "next/form";
import React, { useEffect } from "react";
import { useForm } from "@/hooks/use-form";
import { udpateUserStatusAction } from "../../action/user";

interface AdminUesrStatusProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  selected: string | null;
}

const AdminUserStatusModal = ({
  userId,
  selected,
  open,
  onOpenChange,
}: AdminUesrStatusProps) => {
  const { state, formAction, isPending } = useForm(udpateUserStatusAction);

  useEffect(() => {
    if (state.success) onOpenChange(false);
  }, [state, onOpenChange]);

  return (
    <Modal
      title={`Change User Status To ${selected}`}
      description={`You are about to change the user's status to "${selected}".`}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form action={formAction}>
        <input type="hidden" value={userId} name="user-id" />
        <input type="hidden" value={selected || ""} name="user-status" />
        <div className="flex items-center justify-end gap-3">
          <Button type="button" onClick={() => onOpenChange(false)} variant="outline" disabled={isPending}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            type="submit"
            variant={selected === "Banned" ? "destructive" : "default"}
          >
            {selected === "Banned" ? <BanIcon /> : <Check />}
            <span>Change</span>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AdminUserStatusModal;

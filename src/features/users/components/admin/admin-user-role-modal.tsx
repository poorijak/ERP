import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Repeat } from "lucide-react";
import Form from "next/form";
import React, { useEffect } from "react";
import { updateUserRoleAction } from "../../action/user";
import { useForm } from "@/hooks/use-form";

interface AdminUserRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  selected: string | null;
}

const AdminUserRoleModal = ({
  userId,
  selected,
  open,
  onOpenChange,
}: AdminUserRoleModalProps) => {
  const { state, formAction, isPending } = useForm(updateUserRoleAction);

  useEffect(() => {
    if (state.success) onOpenChange(false);
  }, [state, onOpenChange]);

  return (
    <Modal
      title={`Change User Role`}
      description={`You are about to change the user's role to "${selected}".`}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form action={formAction}>
        <input type="hidden" value={userId} name="user-id" />
        <input type="hidden" value={selected || ""} name="user-role" />
        <div className="flex items-center justify-end gap-3">
          <Button onClick={() => onOpenChange(false)} variant="outline" type="button">
            Cancel
          </Button>
          <Button disabled={isPending} type="submit">
            <Repeat />
            <span>Change</span>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AdminUserRoleModal;

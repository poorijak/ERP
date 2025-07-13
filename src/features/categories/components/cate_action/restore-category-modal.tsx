import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/submit-btn";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/use-form";
import { CategoryType } from "@/types/category";
import { RefreshCcw } from "lucide-react";
import Form from "next/form";
import { restoreCategoryAction } from "@/features/categories/actions/categories";
import { useEffect } from "react";

interface RestoreCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryType | null;
}

const RestoreCategoryModal = ({
  open,
  onOpenChange,
  category,
}: RestoreCategoryModalProps) => {
  const { state, formAction, isPending } = useForm(restoreCategoryAction);

  useEffect(() => {
    if (state.success) onOpenChange(false);
  }, [state, onOpenChange]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Restore Category"
      description="Are you sure want to restore the category?"
    >
      <Form action={formAction}>
        <input type="hidden" name="category-id" value={category?.id} />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <SubmitBtn
            name="Restore"
            icon={RefreshCcw}
            className="bg-green-600 hover:bg-green-600/80"
            pending={isPending}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default RestoreCategoryModal;

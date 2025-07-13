import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const Modal = ({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
}: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    {/* ใช้ cn เพื่อทำการ override เมื่อมี class ซ้ำกัน */}
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;

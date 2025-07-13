"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import React, { useTransition } from "react";
import { addToCartAction } from "../actions/carts";
import { toast } from "sonner";

interface AddtoCartButtonProps {
  productId: string;
  stock: number;
  className?: string;
  children?: React.ReactNode;
}

const AddToCartButton = ({
  productId,
  stock,
  className,
  children,
}: AddtoCartButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleAddtoCart = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("product-id", productId);
      formData.append("product-count", "1");

      const result = await addToCartAction(formData);

      if (result && result.message) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    });
  };

  return (
    <Button
      className={className}
      onClick={handleAddtoCart}
      disabled={stock <= 0 || isPending}
    >
      <ShoppingCart size={16} />
      {children || "เพิ่มสินค้าลงตะกร้า"}
    </Button>
  );
};

export default AddToCartButton;

import { getCategories } from "@/features/categories/db/categories";
import ProductForm from "@/features/products/components/product-form";
import React from "react";

const NewProductPage = async () => {
  const category = await getCategories();

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold">Add new Product</h1>
        <p className="text-muted-foreground text-sm">Create a new product</p>
      </div>
      <div>
        <ProductForm category={category} />
      </div>
    </div>
  );
};

export default NewProductPage;

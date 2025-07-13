"use client";

import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/hooks/use-form";
import { CategoryType } from "@/types/category";
import { Save } from "lucide-react";
import Form from "next/form";
import React, { useState } from "react";
import { productAction } from "../action/product";
import ErrorMessage from "@/components/shared/error-message";
import ProductImageUpload from "@/features/products/components/product_comp/product-image-upload";
import { ProductType } from "@/types/product";

interface NewProductProps {
  category: CategoryType[];
  product?: ProductType | null;
}

const ProductForm = ({ category, product }: NewProductProps) => {
  // Image State
  const [productImage, setProductImage] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [deletedImageId, setDeletedImageId] = useState<string[]>([]);

  // Price State
  const [basePrice, setBasePrice] = useState(
    product ? product.basePrice.toString() : ""
  );
  const [salePrice, setSalePrice] = useState(
    product ? product.price.toString() : ""
  );

  const { isPending, errors, formAction, clearErrors } = useForm(
    productAction,
    "/admin/products"
  );

  const calDiscount = () => {
    const basePriceNum = parseFloat(basePrice) || 0;
    const salePriceNum = parseFloat(salePrice) || 0;

    if (basePriceNum === 0 || salePriceNum === 0) return "0%";
    if (basePriceNum <= salePriceNum) return "0%";

    const discount = ((basePriceNum - salePriceNum) / basePriceNum) * 100;

    return `${discount.toFixed(2)}%`;
  };

  const handdleImageChange = (
    image: File[],
    index: number,
    deletedId: string[] = []
  ) => {
    setProductImage(image);
    setMainImageIndex(index);
    setDeletedImageId(deletedId);
  };

  const haddleSubmit = (formData: FormData) => {
    // เช็คว่าถ้ามี product ส่งมาผ่าน props ก็คือ update
    if (product) {
      formData.append("product-id", product.id);
    }

    if (productImage.length > 0) {
      productImage.forEach((file) => {
        formData.append("images", file);
      });
    }
    formData.append("mainImageIndex", mainImageIndex.toString());

    // เช็คว่ามีการลบรูปในการ update มั้ย
    if (deletedImageId.length > 0) {
      formData.append("deleted-image-ids", JSON.stringify(deletedImageId)); // deletedImageId เป็น string[] แต่ append ต้องการเป็น string เลยต้องแปลงจาก string[] เป็น string
    }

    return formAction(formData);
  };

  return (
    <Card className="max-w-4xl md:max-w-full px-0">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          Product Information
        </CardTitle>
        <CardDescription>
          Enter the details of your new products
        </CardDescription>

        <Form
          action={haddleSubmit}
          className="flex flex-col gap-4"
          onChange={clearErrors}
        >
          {/* ฺฺBasic information */}
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="font-medium">Basic Informaiton</h3>

              {/* Product Image Section */}
              <ProductImageUpload
                onImageChange={handdleImageChange}
                existingImages={product?.images}
              />

              {/* Product Title */}
              <div>
                <InputForm
                  label="Product title"
                  id="title"
                  name="title"
                  placeholder="Enter product title"
                  defaultValue={product?.title}
                  required
                />
                {/* Error Message */}
                {errors.title && <ErrorMessage error={errors.title[0]} />}
              </div>

              {/* Product Description */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter descritption product"
                  className="min-h-20"
                  defaultValue={product?.description}
                />
                {/* Error Message */}
                {errors.description && (
                  <ErrorMessage error={errors.description[0]} />
                )}
              </div>

              {/* Category Selection */}
              <div>
                <Label htmlFor="description">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select name="category-id" defaultValue={product?.categoryId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Catgory" />
                  </SelectTrigger>
                  <SelectContent>
                    {category
                      .filter((c) => c.status === "Active")
                      .map((cate, index) => (
                        <SelectItem key={index} value={cate.id}>
                          {cate.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <ErrorMessage error={errors.categoryId[0]} />
                )}
              </div>
            </div>

            {/* Pricing information */}
            <div className="flex flex-col gap-4">
              <h3 className="font-medium">Pricing Informaiton</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <InputForm
                    label="Cost Price"
                    id="cost"
                    name="cost"
                    type="number"
                    min={0}
                    step={0.01}
                    defaultValue={product?.cost}
                    placeholder="0.00"
                  />
                  {/* error message */}
                  {errors.cost && <ErrorMessage error={errors.cost[0]} />}
                </div>
                <div className="flex flex-col gap-2">
                  <InputForm
                    label="Base Price"
                    id="base-price"
                    name="base-price"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    required
                    defaultValue={product?.basePrice || basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                  />
                  {/* error message */}
                  {errors.basePrice && (
                    <ErrorMessage error={errors.basePrice[0]} />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <InputForm
                    label="Sale Price"
                    id="sale-price"
                    name="sale-price"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    defaultValue={product?.basePrice || basePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                  />
                  {/* error message */}
                  {errors.price && <ErrorMessage error={errors.price[0]} />}
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Discount</Label>
                  <div className="h-9 px-3 rounded-md border border-input bg-gray-50 flex items-center">
                    {calDiscount()}
                  </div>
                  {/* error message */}
                </div>
              </div>
            </div>

            {/* Storck Informaiton */}
            <div className="flex flex-col gap-4">
              <h3 className="font-medium">Storck Informaiton</h3>
              <div>
                <InputForm
                  label="Storck Quantity"
                  id="stock"
                  name="stock"
                  type="number"
                  min={0}
                  placeholder="0"
                  required
                  defaultValue={product?.stock}
                />
                {/* error message */}
                {errors.stork && <ErrorMessage error={errors.stork[0]} />}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <SubmitBtn
              name={product ? "Update Product" : "Save Product"}
              icon={Save}
              pending={isPending}
              className="w-full"
            />
          </CardFooter>
        </Form>
      </CardHeader>
    </Card>
  );
};

export default ProductForm;

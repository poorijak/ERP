import { Button } from "@/components/ui/button";
import { getFeatureProduct } from "@/features/products/db/products";
import { ArrowRight, Sparkle } from "lucide-react";
import Link from "next/link";
import React from "react";
import ProductCard from "../products/product-card";

const FeatureProduct = async () => {
  const product = await getFeatureProduct();

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-2 border border-primary/60 rounded-full">
            <Sparkle size={14} />
            <span>สินค้าแนะนำ</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold">
            สินค้าขายดีประจำสัปดาห์
          </h2>
        </div>

        <Button variant={"ghost"} asChild className="group">
          <Link href={"/products"}>
            <span>ดูสินค้าทั้งหมด</span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-col-4 gap-4 md:gap-6">
        {product.map((product, index) => (
            <ProductCard key={index} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeatureProduct;

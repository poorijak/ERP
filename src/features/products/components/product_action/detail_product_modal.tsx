import Modal from "@/components/shared/modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductType } from "@/types/product";
import {
  Clock,
  DollarSign,
  FileText,
  ImageIcon,
  Package,
  ShoppingBag,
  Tag,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import dayjs from "@/lib/dayjs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/format/formatPrice";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ProductDetailModal {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductType | null;
}

const DetailProductModal = ({
  open,
  onOpenChange,
  product,
}: ProductDetailModal) => {
  if (!product) {
    return null;
  }

  const formattedDate = dayjs(product.createdAt).fromNow();

  // ใช้ switch case เพื่อทำให้เป็น dynamic แทนที่จะใช้ cn เพราะ cn มันยาว และกลับมาแก้ซ้ำนาน
  const stockColor = (() => {
    switch (true) {
      case product.stock <= 0:
        return "text-red-600";
      case product.stock <= product.lowStock:
        return "text-amber-500";
      default:
        return "text-green-500";
    }
  })();

  // ใช้ switch case เพื่อทำให้เป็น dynamic
  const stockStatus = (() => {
    switch (true) {
      case product.stock <= 0:
        return "Out of stock";
      case product.stock <= product.lowStock:
        return "Low Stock";
      default:
        return "In stock";
    }
  })();

  const discount =
    product.basePrice > product.price
      ? (
          ((product.basePrice - product.price) / product.basePrice) *
          100
        ).toFixed(2)
      : "0";

  const profitPerUnit = product.cost > 0 ? product.price - product.cost : 0;
  const profitMagin =
    product.cost > 0
      ? ((profitPerUnit / product.cost) * 100).toFixed(2)
      : "N/A";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={product?.title}
      description={`SKU : ${product?.sku}`}
      className="md:max-w-3xl"
    >
      <Tabs>
        <TabsList className="grid grid-cols-3 mb-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">
            Images ({product.images.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ScrollArea className="max-h-[500px] overflow-y-auto">
            <Card className="mb-4">
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                  {/* Main Image */}
                  <div className="relative aspect-square border rounded-md overflow-hidden group">
                    <Image
                      alt={product.title}
                      src={
                        product.mainImage?.url ||
                        "/images/no-product-image.webp"
                      }
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Product info */}
                  <div className="p-4 flex-col">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge
                        variant={
                          product.status === "Active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {product.status}
                      </Badge>
                      <Badge
                        variant={"outline"}
                        className="flex items-center gap-1"
                      >
                        <Tag size={12} />
                        <span> {product.category.name}</span>
                      </Badge>
                    </div>

                    <h2 className="text-xl font-bold line-clamp-2 mb-1">
                      {product.title}
                    </h2>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>Added {formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Package size={12} />
                        <span className={`text-sm font-medium ${stockColor}`}>
                          {stockStatus}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.stock} item left
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <span>{formatPrice(product.price)}</span>

                        {product.basePrice > product.price && (
                          <div className="flex items-center gap-1">
                            <span className="text-sm line-through text-muted-foreground">
                              {formatPrice(product.basePrice)}
                            </span>
                            <Badge variant={"secondary"} className="text-xs">
                              {discount}% off
                            </Badge>
                          </div>
                        )}
                      </div>

                      {product.cost > 0 && (
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>Cost : {formatPrice(product.cost)}</span>
                          <span>•</span>
                          <span>
                            Profit {formatPrice(profitPerUnit)} ({profitMagin})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-sm font-semibold mb-2">Sale Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md p-2">
                    <ShoppingBag size={20} className="text-primary mb-1" />
                    <span className="font-medium text-primary">
                      {product.sold}
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      sale
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md p-2">
                    <DollarSign size={20} className="text-emerald-500 mb-1" />
                    <span className="font-medium text-emerald-500">
                      {formatPrice(product.sold * product.price)}
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      sale
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md p-2">
                    <FileText size={20} className="text-primary mb-1" />
                    <span className="font-medium text-primary">
                      {product.cost > 0
                        ? formatPrice(
                            product.sold * (product.price - product.cost)
                          )
                        : "N/A"}
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      Income
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="details">
          <ScrollArea className="max-h-[500px] overflow-y-auto">
            <Card className="break-all">
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold">Product detail</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    Specific information
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <h2 className="text-muted-foreground">SKU : </h2>
                      <p className="font-medium">{product.sku}</p>
                    </div>
                    <div>
                      <h2 className="text-muted-foreground">Category </h2>
                      <p className="font-medium">{product.category.name}</p>
                    </div>
                    <div>
                      <h2 className="text-muted-foreground">Status </h2>
                      <Badge
                        variant={
                          product.status === "Active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {product.status}
                      </Badge>
                    </div>
                    <div>
                      <h2 className="text-muted-foreground">Stock </h2>
                      <p className={stockColor}>{product.stock}</p>
                    </div>
                    <div>
                      <h2 className="text-muted-foreground">Base Price </h2>
                      <p className="font-medium">
                        {formatPrice(product.basePrice)}
                      </p>
                    </div>
                    <div>
                      <h2 className="text-muted-foreground">Sale Price</h2>
                      <p className="font-medium">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <div>
                      <h2 className="text-muted-foreground">Discount</h2>
                      <p className="font-medium">{discount}%</p>
                    </div>
                    <div>
                      <h2 className="text-muted-foreground">Create at</h2>
                      <p className="font-medium">
                        {dayjs(product.createdAt).format("ll")}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    Sale information
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Total sale</TableHead>
                        <TableHead>Income</TableHead>
                        <TableHead>Total cost</TableHead>
                        <TableHead>Profit</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      <TableRow>
                        <TableCell>{product.sold} items</TableCell>
                        <TableCell>
                          {formatPrice(product.sold * product.price)}
                        </TableCell>
                        <TableCell>
                          {formatPrice(product.sold * product.cost)}
                        </TableCell>
                        <TableCell>
                          {formatPrice(
                            product.sold * (product.price - product.cost)
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="images">
          <ScrollArea className="max-h-[500px] overflow-y-auto">
            <Card>
              <CardContent>
                <h3 className="text-sm font-semibold mb-3">
                  All images ({product.images.length} photos)
                </h3>

                {product.images.length > 0 ? (
                  <div className="grid grid-col-2 sm:grid-cols-3 gap-3">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className={cn(
                          "relative aspect-square border rounded-md overflow-hidden cursor-pointer group",
                          { "ring-2 ring-primary": image.isMain }
                        )}
                      >
                        <Image
                          alt={`Product image ${index + 1}`}
                          src={image.url}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {image.isMain && (
                          <Badge className="absolute top-1 left-1 text-[10px] z-10">
                            Main
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colorsq duration-300"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center py-10 bg-muted/50 rounded-md">
                    <ImageIcon
                      size={40}
                      className="text-muted-foreground mb-2 opacity-40"
                    />
                    <p className="text-sm text-muted-foreground">
                      There are no images for this product
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Modal>
  );
};

export default DetailProductModal;

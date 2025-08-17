"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ProductType } from "@/types/product";
import {
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import DeleteProductModal from "./product_action/delete_product_modal";
import RestoreProductModal from "./product_action/restore_product_modal";
import DetailProductModal from "./product_action/detail_product_modal";
import { useRouter, useSearchParams } from "next/navigation";
import Paginaiton from "@/components/shared/pagination";

interface ProductListProps {
  products: ProductType[];
  totalCount: number;
  page: number;
  limit: number;
}

const ProductList = ({
  products,
  totalCount,
  page,
  limit,
}: ProductListProps) => {

  const searchParams = useSearchParams();
  const route = useRouter();

  // page
  const totalPage = Math.ceil(totalCount / limit);

  

  // modal State
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );

  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isRestoreModal, setIsRestoreModal] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);

  // filter state
  const [activeTabs, setActiveTabs] = useState("all");
  const [productFilter, setProductFilter] = useState<ProductType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let resutls = [...products];
    if (activeTabs === "active") {
      resutls = resutls.filter((product) => product.status === "Active");
    } else if (activeTabs === "inactive") {
      resutls = resutls.filter((product) => product.status === "Inactive");
    } else if (activeTabs === "low-stock") {
      resutls = resutls.filter((product) => product.stock <= product.lowStock);
    }

    if (searchTerm) {
      resutls = resutls.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setProductFilter(resutls);
  }, [activeTabs, products, searchTerm]);

  const handleTabActive = (value: string) => {
    setActiveTabs(value);
  };

  const handleClearInput = () => {
    setSearchTerm("");
  };

  const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteProudct = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDeleteModal(true);
  };

  const handleRestoreProduct = (product: ProductType) => {
    setSelectedProduct(product);
    setIsRestoreModal(true);
  };
  const handleDetailProduct = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDetailModal(true);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    route.push(`/admin/products?${newParams.toString()}`);
  };

  

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg sm:text-xl">Products</CardTitle>
            <Button asChild className="mb-4">
              <Link href="/admin/products/new">
                <Plus size={16} />
                <span>Add Product</span>
              </Link>
            </Button>
          </div>

          <Tabs value={activeTabs} onValueChange={handleTabActive}>
            <TabsList className="mb-4 grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            </TabsList>

            <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex gap-2">
                <Badge variant="outline" className="py-1 sm:px-3">
                  <span className="font-semibold text-blue-600">
                    {products.length}
                  </span>
                  Total
                </Badge>
                <Badge variant="outline" className="py-1 sm:px-3">
                  <span className="font-semibold text-green-600">
                    {products.filter((p) => p.status === "Active").length}
                  </span>
                  Active
                </Badge>
                <Badge variant="outline" className="py-1 sm:px-3">
                  <span className="font-semibold text-gray-500">
                    {products.filter((p) => p.status === "Inactive").length}
                  </span>
                  Inactive
                </Badge>
                <Badge variant="outline" className="py-1 sm:px-3">
                  <span className="font-semibold text-amber-600">
                    {
                      products.filter(
                        (p) => p.stock <= p.lowStock && p.status === "Active",
                      ).length
                    }
                  </span>
                  Low Stock
                </Badge>
              </div>

              <div className="relative w-full sm:w-64">
                <Search
                  size={16}
                  className="text-muted-foreground absolute top-2.5 left-2"
                />
                <Input
                  value={searchTerm}
                  onChange={handleSearchTerm}
                  placeholder="Search products..."
                  className="pl-8"
                />
                {searchTerm.length > 0 && (
                  <X
                    onClick={handleClearInput}
                    size={16}
                    className="text-muted-foreground hover:text-primary absolute top-2.5 right-2 hover:cursor-pointer"
                  />
                )}
              </div>
            </div>
          </Tabs>
        </CardHeader>

        <CardContent className="h-11/12">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {productFilter.length > 0 ? (
                productFilter.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Image
                        alt={product.title}
                        src={
                          product.mainImage?.url ||
                          "/images/no-product-image.webp"
                        }
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.title}</div>
                      <div className="text-muted-foreground text-xs">
                        {product.sku || "No SKU"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{product.category.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {product.price.toLocaleString()}
                      </div>
                      {product.basePrice !== product.price && (
                        <div className="text-muted-foreground text-xs line-through">
                          {product.basePrice.toLocaleString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn("text-sm", {
                          "font-medium text-amber-500":
                            product.stock <= product.lowStock,
                        })}
                      >
                        {product.stock}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "Active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDetailProduct(product)}
                          >
                            <Eye size={15} />
                            <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <Pencil size={15} />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {product.status === "Active" ? (
                            <DropdownMenuItem
                              onClick={() => handleDeleteProudct(product)}
                            >
                              <Trash2 size={15} className="text-destructive" />
                              <span className="text-destructive">Delete</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleRestoreProduct(product)}
                            >
                              <RefreshCcw
                                size={15}
                                className="text-green-600"
                              />
                              <span className="text-green-600">Restore</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-muted-foreground h-40 text-center"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
        </CardContent>

        <CardFooter>
          <Paginaiton
            page={page}
            totalPage={totalPage}
            onPageChange={handlePageChange}
          />
        </CardFooter>
      </Card>

      <DeleteProductModal
        onOpenChange={setIsDeleteModal}
        open={isDeleteModal}
        product={selectedProduct}
      />

      <RestoreProductModal
        onOpenChange={setIsRestoreModal}
        open={isRestoreModal}
        product={selectedProduct}
      />

      <DetailProductModal
        open={isDetailModal}
        onOpenChange={setIsDetailModal}
        product={selectedProduct}
      />
    </>
  );
};
export default ProductList;

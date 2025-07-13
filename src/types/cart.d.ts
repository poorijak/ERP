import { Cart } from "@prisma/client";
import { ProductType } from "./product";

export interface CartItem {
  id: string;
  count: number;
  price: number;
  product: ProductType;
}

export interface CartType extends Cart {
  items: CartItem[];
  itemCount: number;
}

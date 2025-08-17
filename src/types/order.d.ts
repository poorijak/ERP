import { Order, OrderItem } from "@prisma/client";
import { ProductType } from "./product";
import { UserType } from "./user";
import { AddressType } from "./address";

export interface OrderType extends Order {
    items: (OrderItem & {
        product : ProductType
    })[]
    address? : AddressType
    customer : UserType
    createdAtFomatted : string
    paymentFormatted? : string | null,
    totalItems? : number
}

interface OrderUserType {
  orderList: (Order & {
    items: {
      totalPrice: number;
      quantity: number;
    }[];
  })[];
  totalSpend: number;
  totalOrder: number;
  lastOrder: Order | null;
}

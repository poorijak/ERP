import { Address } from "@prisma/client";

export interface AddressType extends Omit<Address, "createdAt" | "updatedAt"> {
  fullAddress: string | null;
}

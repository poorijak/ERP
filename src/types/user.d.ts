import { User } from "@prisma/client";
import { AddressType } from "./address";

export interface UserType
  extends Omit<User, "password" | "pictureId" | "updatedAt"> {
  totalUser?: number;
  address?: AddressType[];
}

export interface UserWithAddress
  extends Omit<User, "password" | "pictureId" | "updatedAt"> {
  address: AddressType[];
}

export interface UserListType {
  user: UserType[];
  totalUser: number;
  activeUserCount: number;
  bannedUserCount: number;
}

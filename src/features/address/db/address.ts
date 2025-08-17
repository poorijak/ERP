import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { redirect } from "next/navigation";
import { getUserAddressTag, revalidateAddressCache } from "./cache";
import { authCheck } from "@/features/auths/db/auths";
import { canCreateAddress, canUpdateAddress } from "../permission/address";
import { addressSchema } from "../schema/address";

interface createAddressInput {
  addressLine1: string;
  addressLine2?: string;
  street: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  isMainAddress: string;
}
interface updateAddressInput {
  addressId: string;
  addressLine1: string;
  addressLine2?: string;
  street: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  isMainAddress: string;
}

export const getAddressByUserId = async (userId: string) => {
  "use cache";

  if (!userId) {
    redirect("/auth/signin");
  }
  cacheLife("hours");
  cacheTag(getUserAddressTag(userId));
  try {
    const address = await db.address.findMany({
      where: { userId },
      select: {
        id: true,
        addressLine1: true,
        addressLine2: true,
        street: true,
        subdistrict: true,
        district: true,
        province: true,
        postalCode: true,
        isDefault: true,
        userId: true,
      },
      orderBy: {
        // เอาค่า true มาก่อนแล้วเรียกเป็นค่า false
        isDefault: "desc",
      },
    });

    if (!address || address.length === 0) {
      return [];
    }

    return address.map((addr) => {
      const fullAddress = [
        addr.addressLine1,
        addr.addressLine1,
        addr.addressLine2,
        addr.street,
        addr.district,
        addr.subdistrict,
        addr.province,
        addr.postalCode,
      ]
        .filter(Boolean)
        .join(" ");
      return {
        ...addr,
        fullAddress,
      };
    });
  } catch (error) {
    console.error("Error getting address by id ", error);
    return [];
  }
};

export const createAddress = async (input: createAddressInput) => {
  const user = await authCheck();

  if (!user || !canCreateAddress(user)) {
    redirect("auth/signin");
  }
  try {
    const isMainAddress = input.isMainAddress === "on";

    const { data, error, success } = addressSchema.safeParse(input);

    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    const existingUser = await db.user.findUnique({
      where: { id: user.id, status: "Active" },
    });

    if (!existingUser) {
      return {
        message: "ไม่พบผู้ใช้",
      };
    }

    if (isMainAddress) {
      await db.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const newCreateAddress = await db.address.create({
      data: {
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        street: data.street,
        district: data.district,
        subdistrict: data.subdistrict,
        province: data.province,
        postalCode: data.postalCode,
        isDefault: isMainAddress,
        userId: existingUser.id,
      },
    });

    const fullAddress = [
      newCreateAddress.addressLine1,
      newCreateAddress.addressLine1,
      newCreateAddress.addressLine2,
      newCreateAddress.street,
      newCreateAddress.district,
      newCreateAddress.subdistrict,
      newCreateAddress.province,
      newCreateAddress.postalCode,
    ]
      .filter(Boolean)
      .join(" ");

    const newAddress = await db.address.update({
      where: { id: newCreateAddress.id },
      data: {
        fullAddress: fullAddress,
      },
    });

    revalidateAddressCache(newAddress.id, user.id);
  } catch (error) {
    console.error("Error creating new address", error);
    return {
      message: "Something went wrong. Please try again later",
    };
  }
};

export const updateAddress = async (input: updateAddressInput) => {
  const user = await authCheck();

  if (!user || !canUpdateAddress(user)) {
    redirect("/auth/signin");
  }
  try {
    const isMainAddress = input.isMainAddress === "on";

    const { data, success, error } = addressSchema.safeParse(input);

    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    if (isMainAddress) {
      await db.address.updateMany({
        where: { userId: user.id },
        data: {
          isDefault: false,
        },
      });
    }

    const existingAddress = await db.address.findUnique({
      where: { id: input.addressId },
    });

    if (existingAddress?.userId !== user.id) {
      return {
        message: "คุณไม่สามารถแก้ไขที่อยู่นี้ได้",
      };
    }

    const updateAddress = await db.address.update({
      where: { id: input.addressId, userId: user.id },
      data: {
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        street: data.street,
        district: data.district,
        subdistrict: data.subdistrict,
        province: data.province,
        postalCode: data.postalCode,
        isDefault: isMainAddress,
      },
    });

    revalidateAddressCache(updateAddress.id, user.id);
  } catch (error) {
    console.error("Error updating address :", error);
    return {
      message: "Something went wrong , Please try again",
    };
  }
};

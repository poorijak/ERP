import { z } from "zod";

const MIN_ADDRESS_LENGTH = 1;
const POSTAL_REGEX = /^\d{5}$/;

const ERROR_MESSAGE = {
  addressLine1: "กรุณากรอกบ้านเลขที่ / หมู่บ้าน / ซอย",
  addressLine2: "", // ไม่จำเป็นต้อง error เพราะเป็น optional
  street: "กรุณากรอกชื่อถนน",
  subdistrict: "กรุณากรอกแขวง / ตำบล",
  district: "กรุณากรอกเขต / อำเภอ",
  province: "กรุณากรอกจังหวัด",
  postalCode: "กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง 5 หลัก",
};

export const addressSchema = z.object({
  addressLine1: z
    .string()
    .min(MIN_ADDRESS_LENGTH, { message: ERROR_MESSAGE.addressLine1 }),
  addressLine2: z
    .string()
    .min(MIN_ADDRESS_LENGTH, { message: ERROR_MESSAGE.addressLine2 }),
  street: z.string().min(MIN_ADDRESS_LENGTH, { message: ERROR_MESSAGE.street }),
  subdistrict: z
    .string()
    .min(MIN_ADDRESS_LENGTH, { message: ERROR_MESSAGE.subdistrict }),
  district: z
    .string()
    .min(MIN_ADDRESS_LENGTH, { message: ERROR_MESSAGE.district }),
  province: z
    .string()
    .min(MIN_ADDRESS_LENGTH, { message: ERROR_MESSAGE.province }),
  postalCode: z
    .string()
    .regex(POSTAL_REGEX, { message: ERROR_MESSAGE.postalCode }),
});

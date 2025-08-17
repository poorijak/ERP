import { z } from "zod";

const PHONE_LENGTH = 10;
const PHONE_REGEX = /^((06|08|09)[0-9]{8})$/;
const MIN_NAME_LENGHT = 8;
const MIN_ADDRESS_LENGTH = 10;
const MAX_ADDRESS_LENGTH = 255;

const ERROR_MESSAGE = {
  name: `ชื่อต้องมีความยาวอย่างน้อย ${MIN_NAME_LENGHT} ตัวอักษร`,
  phone: {
    length: `เบอร์โทรศัพท์จะต้องมี ${PHONE_LENGTH} หลัก`,
    regex: `เบอร์โทรศัพท์ไม่ถูกต้อง`,
  },
  address: {
    min: `ที่อยู่ต้องความยาวอย่างน้อย ${MIN_ADDRESS_LENGTH} ตัวอักษร`,
    max: `ที่อยู่ต้องไม่เกิน ${MAX_ADDRESS_LENGTH} ตัวอักษร`,
  },
};

export const updateUserProfileSchema = z.object({
  name: z
    .string()
    .optional()
    .refine((name) => !name || name.length >= MIN_NAME_LENGHT, {
      message: ERROR_MESSAGE.name,
    }),

  tel: z
    .string()
    .optional()
    .refine(
      (phone) =>
        !phone || (phone.length === PHONE_LENGTH && PHONE_REGEX.test(phone)),
      { message: ERROR_MESSAGE.phone.regex },
    ),
});

export const addressSchema = z.object({
  address: z
    .string()
    .min(MIN_ADDRESS_LENGTH, { message: ERROR_MESSAGE.address.min })
    .max(MAX_ADDRESS_LENGTH, { message: ERROR_MESSAGE.address.max }),
});

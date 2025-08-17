import { z } from "zod";

const MIN_TITLE_LENGTH = 3;
const MIN_DESC_LENGTH = 10;


const ERROR_MESSAGE = {
  title: `Product title must be at least ${MIN_TITLE_LENGTH} characters`,
  description: `Description must be at least ${MIN_DESC_LENGTH} characters`,
  categoryId: "Category is required",
  basePrice: "Base price must be a positive number",
  price: "Price must be a positive number",
  stock: "Stock price must be a positive number",
};

export const ProductSchema = z.object({
  title: z.string().min(MIN_TITLE_LENGTH, { message: ERROR_MESSAGE.title }),

  description: z
    .string()
    .min(MIN_DESC_LENGTH, { message: ERROR_MESSAGE.description }),

  categoryId: z.string().min(1, { message: ERROR_MESSAGE.categoryId }),

  cost: z.coerce.number().nonnegative().optional(),

  basePrice: z.coerce.number().positive({ message: ERROR_MESSAGE.basePrice }),

  price: z.coerce.number().positive({ message: ERROR_MESSAGE.price }),

  stock: z.coerce.number().positive({ message: ERROR_MESSAGE.stock }),
});


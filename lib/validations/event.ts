import { z } from "zod";

export const EventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),
  description: z.string().min(1, "Description is required"),
  image: z.preprocess(
    (val) =>
      typeof val === "string" && val.trim() === "" ? undefined : val,
    z.string().url("Image must be a valid URL").optional()
  ),
  location: z.string().min(1, "Location is required"),
  date: z.string().min(1, "Date is required"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price cannot be negative"),
  capacity: z.coerce
    .number({ invalid_type_error: "Capacity must be a number" })
    .int("Capacity must be a whole number")
    .min(1, "Capacity must be at least 1"),
});

export type EventFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    image?: string[];
    location?: string[];
    date?: string[];
    price?: string[];
    capacity?: string[];
    _form?: string[];
  };
};

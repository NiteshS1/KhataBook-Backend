import { z } from 'zod';

const orderItemSchema = z.object({
    itemName: z.string().min(1, "Item name is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    price: z.number().min(0, "Price must be a positive number"),
    total: z.number().min(0, "Total must be a positive number")
});

export const createOrderSchema = z.object({
    customerName: z.string().min(1, "Customer name is required"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    items: z.array(orderItemSchema).min(1, "At least one item is required"),
    finalTotal: z.number().min(0, "Final total must be a positive number")
}); 
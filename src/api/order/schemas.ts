import { OrderStatus } from "@prisma/client";
import { z } from "zod";

export const OrderSchema = z.object({
	discount: z
		.number()
		.min(0, { message: "Discount must be a positive value" })
		.default(0),
});

export const OrderStatusSchema = z
	.enum([
		OrderStatus.PENDING,
		OrderStatus.PAID,
		OrderStatus.SHIPPED,
		OrderStatus.DELIVERED,
		OrderStatus.CANCELLED,
	])
	.refine((value) => Object.values(OrderStatus).includes(value), {
		message:
			"Invalid status. Status must be in PENDING, PAID, SHIPPED, DELIVERED, CANCELLED.",
	});

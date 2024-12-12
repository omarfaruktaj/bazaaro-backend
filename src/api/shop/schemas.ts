import { z } from "zod";

export const ShopSchema = z.object({
	name: z.string().min(1, { message: "Shop name is required" }),

	description: z
		.string()
		.min(10, { message: "Description must be at least 10 characters" })
		.max(500, { message: "Description cannot exceed 500 characters" }),

	logo: z
		.string()
		.url({ message: "Logo must be a valid URL" })
		.min(1, { message: "Logo URL is required" }),
});

export const UpdateShopSchema = ShopSchema.partial();
export type ShopSchemaType = z.infer<typeof ShopSchema>;
export type UpdateShopSchemaType = z.infer<typeof UpdateShopSchema>;

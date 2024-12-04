import { z } from "zod";

export const ShopSchema = z.object({
	name: z.string().min(1, { message: "Shop name is required" }),
	description: z.string().optional(),
	logo: z.string().optional(),
});
export const UpdateShopSchema = ShopSchema.partial();
export type ShopSchemaType = z.infer<typeof ShopSchema>;
export type UpdateShopSchemaType = z.infer<typeof UpdateShopSchema>;

import { z } from "zod";

export const ReviewSchema = z.object({
	userId: z.string().uuid(),
	shopId: z.string().uuid(),
	productId: z.string().uuid(),
	rating: z
		.number()
		.min(1, { message: "Rating must be at least 1" })
		.max(5, { message: "Rating cannot exceed 5" }),
	review: z.string().optional(),
});

export const UpdateReviewSchema = ReviewSchema.partial();

export type ReviewSchemaType = z.infer<typeof ReviewSchema>;
export type UpdateReviewSchemaType = z.infer<typeof UpdateReviewSchema>;

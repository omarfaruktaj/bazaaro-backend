import { z } from "zod";

export const ReviewSchema = z.object({
	rating: z
		.number()
		.min(1, { message: "Rating must be at least 1" })
		.max(5, { message: "Rating cannot exceed 5" }),
	review: z.string().optional(),
});
export const ReviewResponseSchema = z.object({
	response: z.string().min(1, { message: "Response cannot be empty." }),
});

export const UpdateReviewSchema = ReviewSchema.partial();
export const UpdateReviewResponseSchema = ReviewResponseSchema.partial();

export type ReviewSchemaType = z.infer<typeof ReviewSchema>;
export type ReviewResponseSchemaType = z.infer<typeof ReviewResponseSchema>;
export type UpdateReviewSchemaType = z.infer<typeof UpdateReviewSchema>;
export type UpdateReviewResponseSchemaType = z.infer<
	typeof UpdateReviewResponseSchema
>;

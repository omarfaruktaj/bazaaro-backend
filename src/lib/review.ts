import type { ReviewSchemaType, UpdateReviewSchemaType } from "@/api/review";
import { db } from "@/config";

export const createReview = ({
	productId,
	rating,
	shopId,
	userId,
	review,
}: ReviewSchemaType) => {
	return db.review.create({
		data: {
			productId,
			rating,
			shopId,
			userId,
			review,
		},
	});
};

export const updateReview = (
	id: string,
	{ productId, rating, shopId, userId, review }: UpdateReviewSchemaType,
) => {
	return db.review.update({
		where: {
			id,
		},
		data: {
			productId,
			rating,
			shopId,
			userId,
			review,
		},
	});
};

export const findReviewById = (id: string) => {
	return db.review.findUniqueOrThrow({
		where: {
			id,
		},
	});
};

export const deleteReviewById = (id: string) => {
	return db.review.delete({
		where: {
			id,
		},
	});
};

export const findAllReview = () => {
	return db.review.findMany();
};

import type { ReviewSchemaType, UpdateReviewSchemaType } from "@/api/review";
import { db } from "@/config";
import { AppError } from "@/utils";
import type { User } from "@prisma/client";
import { findSingleProduct } from "./product";

export const createReview = async (
	user: User,
	productId: string,
	{ rating, shopId, review }: ReviewSchemaType,
) => {
	const product = await findSingleProduct(productId);

	if (!product) throw new AppError("No product found", 404);

	const shop = await db.shop.findUnique({
		where: {
			id: shopId,
		},
	});

	if (!shop) throw new AppError("No shop found.", 404);

	const userOrders = await db.order.findMany({
		where: {
			userId: user.id,
		},
		include: {
			orderItem: true,
		},
	});

	const hasPurchasedProduct = userOrders.some((order) =>
		order.orderItem.some((item) => item.productId === productId),
	);

	if (!hasPurchasedProduct) {
		throw new AppError("You can only review products you have purchased.", 400);
	}

	return db.review.create({
		data: {
			productId,
			rating,
			shopId,
			review,
			userId: user.id,
		},
	});
};

export const updateReview = async (
	userId: string,
	id: string,
	{ rating, review }: UpdateReviewSchemaType,
) => {
	const userReview = await db.review.findUnique({
		where: {
			id,
		},
	});

	if (!userReview) throw new AppError("No review found", 404);

	if (userReview.userId !== userId)
		throw new AppError("You have not permission to update others review", 401);

	return db.review.update({
		where: {
			id,
		},
		data: {
			rating,
			review,
		},
	});
};

export const findReviewById = (id: string) => {
	return db.review.findUnique({
		where: {
			id,
		},
	});
};

export const deleteReview = async (id: string) => {
	const userReview = await db.review.findUnique({
		where: {
			id,
		},
	});

	if (!userReview) throw new AppError("No review found", 404);

	return db.review.delete({
		where: {
			id,
		},
	});
};

export const findAllReview = () => {
	return db.review.findMany();
};

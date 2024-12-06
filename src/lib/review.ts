import type { ReviewSchemaType, UpdateReviewSchemaType } from "@/api/review";
import { db } from "@/config";
import { AppError } from "@/utils";
import { findSingleProduct } from "./product";

export const createReview = async ({
	productId,
	rating,
	shopId,
	userId,
	review,
}: ReviewSchemaType) => {
	const product = await findSingleProduct(productId);
	const shop = await db.shop.findUnique({
		where: {
			id: shopId,
		},
	});

	if (!shop) throw new AppError("No shop found.", 404);

	const userOrders = await db.order.findMany({
		where: {
			userId,
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
			userId,
			review,
		},
	});
};

export const updateReview = (
	id: string,
	{ rating, review }: UpdateReviewSchemaType,
) => {
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

export const deleteReview = (id: string) => {
	return db.review.delete({
		where: {
			id,
		},
	});
};

export const findAllReview = () => {
	return db.review.findMany();
};

import type {
	ReviewResponseSchemaType,
	ReviewSchemaType,
	UpdateReviewResponseSchemaType,
	UpdateReviewSchemaType,
} from "@/api/review";
import { db } from "@/config";
import { AppError, QueryBuilder } from "@/utils";
import type { User } from "@prisma/client";
import { findSingleProduct } from "./product";

export const createReview = async (
	user: User,
	productId: string,
	{ rating, review }: ReviewSchemaType,
) => {
	const product = await findSingleProduct(productId);

	if (!product) throw new AppError("No product found", 404);

	const shop = await db.shop.findUnique({
		where: {
			id: product.shopId,
		},
	});

	if (!shop) throw new AppError("No shop found.", 404);

	const existingReview = await db.review.findFirst({
		where: {
			productId,
			userId: user.id,
		},
	});

	if (existingReview) {
		throw new AppError("You have already reviewed this product.", 400);
	}

	const userOrders = await db.order.findMany({
		where: {
			userId: user.id,
		},
		include: {
			orderItem: {
				include: {
					product: true,
				},
			},
		},
	});

	const hasPurchasedProduct = userOrders.some((order) =>
		order.orderItem.some((item) => item.product.id === productId),
	);

	if (!hasPurchasedProduct) {
		throw new AppError("You can only review products you have purchased.", 400);
	}

	return db.review.create({
		data: {
			productId,
			rating,
			review,
			shopId: shop.id,
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

export const deleteReview = async (user: User, id: string) => {
	const userReview = await db.review.findUnique({
		where: {
			id,
		},
	});

	if (!userReview) throw new AppError("No review found", 404);

	if (user.role === "VENDOR") {
		const shop = await db.shop.findUnique({
			where: {
				userId: user.id,
			},
		});
		if (userReview.shopId !== shop?.id)
			throw new AppError(
				"You have not permission to update others shop Reviews",
				401,
			);

		return db.review.update({
			where: {
				id: userReview.id,
			},
			data: {
				deletedAt: new Date(),
			},
		});
	}

	if (userReview.userId !== user.id && user.role !== "ADMIN")
		throw new AppError(
			"You have not permission to update others response",
			401,
		);

	return db.review.update({
		where: {
			id: userReview.id,
		},
		data: {
			deletedAt: new Date(),
		},
	});
};

export const findAllReview = async (
	user: User,
	query: Record<string, unknown>,
) => {
	if (user.role === "CUSTOMER") {
		const queryBuilder = new QueryBuilder("review", query);

		const data = await queryBuilder
			.filter({ userId: user.id, deletedAt: null })
			.sort()
			.paginate()
			.include()
			.fields()
			.execute();
		const pagination = await queryBuilder.countTotal();

		return {
			data,
			pagination,
		};
	}

	if (user.role === "VENDOR") {
		const shop = await db.shop.findUnique({
			where: {
				userId: user.id,
			},
		});

		if (!shop) throw new AppError("No shop found", 404);
		const queryBuilder = new QueryBuilder("review", query);

		const data = await queryBuilder
			.filter({ shopId: shop.id, deletedAt: null })
			.sort()
			.paginate()
			.include()
			.fields()
			.execute();
		const pagination = await queryBuilder.countTotal();

		return {
			data,
			pagination,
		};
	}

	if (user.role === "ADMIN") {
		const queryBuilder = new QueryBuilder("review", query);

		const data = await queryBuilder
			.filter({ deletedAt: null })
			.sort()
			.paginate()
			.include()
			.fields()
			.execute();
		const pagination = await queryBuilder.countTotal();

		return {
			data,
			pagination,
		};
	}
};

// Review response
export const createReviewResponse = async (
	user: User,
	reviewId: string,
	{ response }: ReviewResponseSchemaType,
) => {
	const existReview = await db.review.findUnique({
		where: { id: reviewId },
		include: {
			shop: true,
		},
	});

	if (!existReview || existReview.deletedAt) {
		throw new AppError("No review found", 404);
	}

	if (!existReview.shop || existReview.shop.userId !== user.id) {
		throw new AppError("You cannot respond to another shop's review.", 401);
	}

	const existingResponse = await db.shopReviewResponse.findUnique({
		where: {
			reviewId,
		},
	});

	if (existingResponse) {
		throw new AppError("This review has already been responded to.", 400);
	}

	return db.shopReviewResponse.create({
		data: {
			response,
			reviewId,
			shopId: existReview.shopId,
		},
	});
};

export const updateReviewResponse = async (
	user: User,
	reviewResponseId: string,
	{ response }: UpdateReviewResponseSchemaType,
) => {
	const userReviewResponse = await db.shopReviewResponse.findUnique({
		where: {
			id: reviewResponseId,
		},
	});

	if (!userReviewResponse) throw new AppError("No Response found", 404);

	const shop = await db.shop.findUnique({
		where: {
			userId: user.id,
		},
	});

	if (!shop) throw new AppError("No shop found.", 404);

	if (userReviewResponse.shopId !== shop.id)
		throw new AppError(
			"You have not permission to update others response",
			401,
		);

	return db.shopReviewResponse.update({
		where: {
			id: userReviewResponse.id,
		},
		data: {
			response,
		},
	});
};

export const deleteReviewResponse = async (
	user: User,
	reviewResponseId: string,
) => {
	const userReviewResponse = await db.shopReviewResponse.findUnique({
		where: {
			id: reviewResponseId,
		},
	});

	if (!userReviewResponse) throw new AppError("No Response found", 404);

	const shop = await db.shop.findUnique({
		where: {
			userId: user.id,
		},
	});

	if (!shop) throw new AppError("No shop found.", 404);

	if (userReviewResponse.shopId !== shop.id)
		throw new AppError(
			"You have not permission to update others response",
			401,
		);

	return db.shopReviewResponse.update({
		where: {
			id: userReviewResponse.id,
		},
		data: {
			deletedAt: new Date(),
		},
	});
};

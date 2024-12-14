import type { ShopSchemaType, UpdateShopSchemaType } from "@/api/shop";
import { db } from "@/config";
import { AppError } from "@/utils";
import { type User, UserRoles } from "@prisma/client";
import { findProductByShopId } from "./product";

export const createShop = async (
	user: User,
	{ name, description, logo }: ShopSchemaType,
) => {
	const existShop = await db.shop.findUnique({
		where: {
			userId: user.id,
		},
	});

	if (existShop) throw new AppError("You already have a shop", 400);

	return db.shop.create({
		data: {
			name,
			description,
			logo,
			userId: user.id,
		},
	});
};

export const updateShop = async (
	id: string,
	{ name, description, logo }: UpdateShopSchemaType,
) => {
	const isExistShop = await db.shop.findUnique({
		where: {
			id,
		},
	});

	if (!isExistShop) throw new AppError("No shop found", 404);

	return db.shop.update({
		where: {
			id,
		},
		data: {
			name,
			description,
			logo,
		},
	});
};

export const findShopById = (id: string) => {
	return db.shop.findUniqueOrThrow({
		where: {
			id,
		},
	});
};

export const deleteShop = async (user: User, shopId: string) => {
	const shop = await db.shop.findUnique({
		where: {
			id: shopId,
		},
		include: {
			user: true,
		},
	});

	if (!shop) throw new AppError("No shop found", 404);

	if (shop.user.id !== user.id && user.role !== UserRoles.ADMIN)
		throw new AppError("You have not permission to delete this product.", 401);

	return db.shop.delete({
		where: {
			id: shopId,
		},
	});
};

export const blackListShop = async (shopId: string) => {
	const shop = await db.shop.findUnique({
		where: {
			id: shopId,
		},
	});

	if (!shop) throw new AppError("No shop found", 404);

	return db.shop.update({
		where: {
			id: shop.id,
		},
		data: {
			isBlacklisted: true,
		},
	});
};
export const findSingleShop = async (shopId: string) => {
	const shop = await db.shop.findUnique({
		where: {
			id: shopId,
		},
		include: {
			review: true,
			shopFollow: true,
		},
	});
	console.log(shop);

	if (!shop) throw new AppError("No shop found", 404);

	return shop;
};

export const findAllShop = () => {
	return db.shop.findMany();
};

export const findProfile = async (user: User) => {
	const shop = await db.shop.findUnique({
		where: {
			userId: user.id,
		},
		include: {
			review: true,
		},
	});

	if (!shop) throw new AppError("No shop found", 404);

	const averageRating =
		shop.review?.length > 0
			? shop.review.reduce((sum, review) => sum + review.rating, 0) /
				shop.review.length
			: 0;

	return {
		...shop,
		averageRating,
	};
};

export const findShopProducts = async (user: User) => {
	const shop = await db.shop.findUnique({
		where: {
			userId: user.id,
		},
	});

	if (!shop) throw new AppError("No shop found", 404);

	const products = await findProductByShopId(shop.id);

	return products;
};

export const followUnfollowShop = async (user: User, shopId: string) => {
	const shop = await db.shop.findUnique({
		where: {
			id: shopId,
		},
	});

	if (!shop) throw new AppError("No shop found", 404);

	const existingFollow = await db.shopFollow.findUnique({
		where: {
			shopId_userId: {
				userId: user.id,
				shopId: shop.id,
			},
		},
	});

	if (existingFollow) {
		const followData = await db.shopFollow.delete({
			where: {
				id: existingFollow.id,
			},
		});

		return followData;
	}

	const follow = await db.shopFollow.create({
		data: {
			shopId: shop.id,
			userId: user.id,
		},
	});

	return follow;
};

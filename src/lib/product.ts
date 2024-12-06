import type { ProductSchemaType, UpdateProductSchemaType } from "@/api/product";
import { db } from "@/config";
import { AppError } from "@/utils";
import { type Prisma, type User, UserRoles } from "@prisma/client";
import { findCategoryById } from "./category";
import { findShopById } from "./shop";

const productSelectFields: Prisma.ProductSelect = {
	name: true,
	description: true,
	categoryId: true,
	image: true,
	price: true,
	quantity: true,
	shopId: true,
	discount: true,
};

export const createProduct = async ({
	name,
	description,
	categoryId,
	image,
	price,
	quantity,
	shopId,
	discount,
}: ProductSchemaType) => {
	const shop = await findShopById(shopId);

	if (!shop) throw new AppError("No shop found.", 404);

	if (shop.isBlacklisted) throw new AppError("Your shop is block listed", 400);

	const category = await findCategoryById(categoryId);

	if (!category) throw new AppError("No category found", 404);

	return db.product.create({
		data: {
			name,
			description,
			categoryId,
			image,
			price,
			quantity,
			shopId,
			discount,
		},
	});
};

export const findProductById = (id: string) => {
	return db.product.findUnique({
		where: {
			id,
			deletedAt: null,
		},
	});
};

export const updateProduct = async (
	userId: string,
	productId: string,

	{
		name,
		description,
		categoryId,
		image,
		price,
		quantity,
		discount,
	}: UpdateProductSchemaType,
) => {
	const product = await db.product.findUnique({
		where: {
			id: productId,
		},
		include: {
			shop: {
				include: {
					user: true,
				},
			},
		},
	});

	if (!product) throw new AppError("No product found", 404);

	if (product.shop.user.id !== userId)
		throw new AppError("You have not permission to update others product", 404);

	return db.product.update({
		where: {
			id: productId,
		},
		data: {
			name,
			description,
			categoryId,
			image,
			price,
			quantity,
			discount,
		},
	});
};

export const deleteProduct = async (user: User, productId: string) => {
	const product = await db.product.findUnique({
		where: {
			id: productId,
		},
		include: {
			shop: {
				include: {
					user: true,
				},
			},
		},
	});

	if (!product) throw new AppError("No product found", 404);

	if (product.shop.user.id !== user.id && user.role !== UserRoles.ADMIN)
		throw new AppError("You have not permission to delete this product.", 401);

	return db.product.delete({
		where: {
			id: productId,
		},
	});
};

export const findAllProduct = () => {
	return db.product.findMany();
};

export const findSingleProduct = async (productId: string) => {
	const product = await db.product.findUnique({
		where: {
			id: productId,
		},
		include: {
			shop: true,
		},
	});

	if (!product) throw new AppError("No product found.", 404);

	return product;
};

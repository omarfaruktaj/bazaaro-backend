import type { ProductSchemaType, UpdateProductSchemaType } from "@/api/product";
import { db } from "@/config";
import { AppError, QueryBuilder } from "@/utils";
import { type Prisma, type User, UserRoles } from "@prisma/client";
import { findCategoryById } from "./category";
import { findShopById } from "./shop";

const productSelectFields: Prisma.ProductSelect = {
	name: true,
	description: true,
	categoryId: true,
	images: true,
	price: true,
	quantity: true,
	shopId: true,
	discount: true,
};

export const createProduct = async ({
	name,
	description,
	categoryId,
	images,
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
			images,
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
		images,
		price,
		quantity,
		discount,
	}: UpdateProductSchemaType,
) => {
	console.log(discount);
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

	const updatedData = await db.product.update({
		where: {
			id: productId,
		},
		data: {
			name,
			description,
			categoryId,
			images,
			price,
			quantity,
			discount,
		},
	});

	console.log(updatedData);
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

	return db.product.update({
		where: {
			id: product.id,
		},
		data: {
			deletedAt: new Date(),
		},
	});
};

export const findAllProduct = async (query: Record<string, unknown>) => {
	const queryBuilder = new QueryBuilder("product", query);

	const data = await queryBuilder
		.search(["name", "description", "category.name"])
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
};

export const findProductByShopId = async (shopId: string) => {
	try {
		const data = await db.product.findMany({
			where: {
				shopId: shopId,
			},
		});

		return data;
	} catch (error) {
		console.log(error);
	}
};

export const findSingleProduct = async (productId: string) => {
	const product = await db.product.findUnique({
		where: {
			id: productId,
		},
		include: {
			shop: true,
			category: true,
			review: {
				include: {
					user: {
						include: {
							profile: true,
						},
					},
				},
			},
		},
	});

	if (!product) throw new AppError("No product found.", 404);

	return product;
};

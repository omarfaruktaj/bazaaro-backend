import type { ProductSchemaType, UpdateProductSchemaType } from "@/api/product";
import { db } from "@/config";
import type { Prisma } from "@prisma/client";

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

export const createProduct = ({
	name,
	description,
	categoryId,
	image,
	price,
	quantity,
	shopId,
	discount,
}: ProductSchemaType) => {
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

export const updateProduct = (
	id: string,
	{
		name,
		description,
		categoryId,
		image,
		price,
		quantity,
		shopId,
		discount,
	}: UpdateProductSchemaType,
) => {
	return db.product.update({
		where: {
			id,
		},
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
	return db.product.findUniqueOrThrow({
		where: {
			id,
		},
	});
};

export const deleteProductById = (id: string) => {
	return db.product.delete({
		where: {
			id,
		},
	});
};

export const findAllProduct = () => {
	return db.product.findMany();
};

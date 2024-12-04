import type { ShopSchemaType, UpdateShopSchemaType } from "@/api/shop";
import { db } from "@/config";

export const createShop = ({
	name,
	userId,
	description,
	logo,
}: ShopSchemaType & { userId: string }) => {
	return db.shop.create({
		data: {
			name,
			description,
			logo,
			userId,
		},
	});
};

export const updateShop = (
	id: string,
	{
		name,
		userId,
		description,
		logo,
	}: UpdateShopSchemaType & { userId: string },
) => {
	return db.shop.update({
		where: {
			id,
		},
		data: {
			name,
			description,
			logo,
			userId,
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

export const deleteShopById = (id: string) => {
	return db.shop.delete({
		where: {
			id,
		},
	});
};

export const findAllShop = (id: string) => {
	return db.shop.findUniqueOrThrow({
		where: {
			id,
		},
	});
};

import type {
	CategorySchemaType,
	UpdateCategorySchemaType,
} from "@/api/category";
import { db } from "@/config";

export const createCategory = ({ name, description }: CategorySchemaType) => {
	return db.category.create({
		data: {
			name,
			description,
		},
	});
};

export const updateCategory = (
	id: string,
	{ name, description }: UpdateCategorySchemaType,
) => {
	return db.category.update({
		where: {
			id,
		},
		data: {
			name,
			description,
		},
	});
};

export const findCategoryById = (id: string) => {
	return db.category.findUniqueOrThrow({
		where: {
			id,
		},
	});
};

export const deleteCategoryById = (id: string) => {
	return db.category.delete({
		where: {
			id,
		},
	});
};

export const findAllCategory = () => {
	return db.category.findMany();
};

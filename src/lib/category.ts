import type {
	CategorySchemaType,
	UpdateCategorySchemaType,
} from "@/api/category";
import { db } from "@/config";
import { AppError } from "@/utils";

export const createCategory = ({ name, description }: CategorySchemaType) => {
	return db.category.create({
		data: {
			name,
			description,
		},
	});
};

export const updateCategory = async (
	id: string,
	{ name, description }: UpdateCategorySchemaType,
) => {
	const existedCategory = await findCategoryById(id);

	if (!existedCategory) return new AppError("No category found", 404);

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
	return db.category.findUnique({
		where: {
			id,
			deletedAt: null,
		},
	});
};

export const findCategoryByName = (name: string) => {
	return db.category.findUnique({
		where: { name, deletedAt: null },
	});
};

export const deleteCategoryById = (id: string) => {
	return db.category.update({
		where: {
			id,
		},
		data: {
			deletedAt: new Date(),
		},
	});
};

export const findAllCategory = () => {
	return db.category.findMany({
		where: {
			deletedAt: null,
		},
	});
};

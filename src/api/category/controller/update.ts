import { updateCategory } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const update = async (req: Request, res: Response, next: NextFunction) => {
	const { name, description, icon } = req.body;
	const id = req.params.categoryId;

	const category = await updateCategory(id, { name, description, icon });

	res
		.status(200)
		.json(new APIResponse(200, "Category updated successfully", category));
};

export default update;

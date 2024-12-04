import { deleteCategoryById } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const deleteController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const id = req.params.categoryId;
	const category = await deleteCategoryById(id);

	res
		.status(200)
		.json(new APIResponse(200, "Category deleted successfully", category));
};

export default deleteController;

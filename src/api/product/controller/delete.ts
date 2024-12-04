import { deleteCategoryById } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const deleteController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const id = req.params.productId;
	const product = await deleteCategoryById(id);

	res
		.status(200)
		.json(new APIResponse(200, "Product deleted successfully", product));
};

export default deleteController;

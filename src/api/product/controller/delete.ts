import { deleteProduct } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const deleteController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const id = req.params.productId;

	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const product = await deleteProduct(user, id);

	res
		.status(200)
		.json(new APIResponse(200, "Product deleted successfully", product));
};

export default deleteController;

import { updateProduct } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const update = async (req: Request, res: Response, next: NextFunction) => {
	const data = req.body;
	const productId = req.params.productId;

	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const product = await updateProduct(user.id, productId, data);

	res
		.status(200)
		.json(new APIResponse(200, "Product updated successfully", product));
};

export default update;

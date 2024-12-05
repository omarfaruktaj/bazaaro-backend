import { findSingleProduct } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getSingleController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const productId = req.params.productId;

	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const product = await findSingleProduct(productId);

	res
		.status(200)
		.json(new APIResponse(200, "Product retrieved successfully", product));
};

export default getSingleController;

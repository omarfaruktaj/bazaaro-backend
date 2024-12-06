import { findSingleProduct } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getSingleController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const productId = req.params.productId;

	const product = await findSingleProduct(productId);

	res
		.status(200)
		.json(new APIResponse(200, "Product retrieved successfully", product));
};

export default getSingleController;

import { findShopProducts } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;

	if (!user)
		return next(new AppError("You have not permission to access", 401));

	const products = await findShopProducts(user);

	res
		.status(200)
		.json(new APIResponse(200, "Products retrieved successfully", products));
};

export default getProducts;

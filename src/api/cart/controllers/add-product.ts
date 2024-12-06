import { cartService } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const addProduct = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const data = req.body;

	if (!user) return next(new AppError("You don't have permission", 401));

	const cart = await cartService.addProductToCart(user, data);

	res
		.status(200)
		.json(new APIResponse(200, "Product added in the cart successfully", cart));
};

export default addProduct;

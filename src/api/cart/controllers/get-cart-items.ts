import { cartService } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getCartWithItems = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = req.user;

	if (!user) return next(new AppError("You don't have permission", 401));

	const cart = await cartService.getCart(user);

	res
		.status(200)
		.json(new APIResponse(200, "cart retrieved successfully", cart));
};

export default getCartWithItems;

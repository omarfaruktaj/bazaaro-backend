import { cartService } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const updateQuantity = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const cartItemId = req.params.cartItemId;
	const { quantity } = req.body;

	const cart = await cartService.updateCartItemQuantity(cartItemId, quantity);

	res
		.status(200)
		.json(new APIResponse(200, "Product quantity updated successfully", cart));
};

export default updateQuantity;

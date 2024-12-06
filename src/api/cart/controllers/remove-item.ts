import { cartService } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
	const cartItemId = req.params.cartItemId;

	const cart = await cartService.deleteCartItem(cartItemId);

	res.status(200).json(new APIResponse(200, "Item deleted successfully", cart));
};

export default deleteItem;

import { deleteShopById } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const deleteShopController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const shopId = req.params.shopId;

	const shop = deleteShopById(shopId);

	res.status(200).json(new APIResponse(200, "Shop deleted successfully", shop));
};

export default deleteShopController;

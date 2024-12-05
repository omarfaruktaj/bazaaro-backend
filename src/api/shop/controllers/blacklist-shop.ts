import { blackListShop } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const blacklistShopController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const shopId = req.params.shopId;

	const shop = await blackListShop(shopId);

	res
		.status(201)
		.json(new APIResponse(200, "Shop block list successfully", shop));
};

export default blacklistShopController;

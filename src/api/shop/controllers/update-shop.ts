import { updateShop } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const updateShopController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { name, description, logo } = req.body;

	const shopId = req.params.shopId;

	const shop = await updateShop(shopId, { name, description, logo });

	res.status(200).json(new APIResponse(200, "Shop updated successfully", shop));
};

export default updateShopController;

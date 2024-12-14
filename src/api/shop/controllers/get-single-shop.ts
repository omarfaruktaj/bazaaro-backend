import { findSingleShop } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getSingleShop = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const shopId = req.params.shopId;

	const shops = await findSingleShop(shopId);

	res
		.status(200)
		.json(new APIResponse(200, "Shop retrieved successfully", shops));
};

export default getSingleShop;

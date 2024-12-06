import { deleteShop } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const deleteShopController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const shopId = req.params.shopId;
	const user = req.user;

	if (!user) return next(new AppError("User is not authenticated", 401));

	const shop = deleteShop(user, shopId);

	res.status(200).json(new APIResponse(200, "Shop deleted successfully", shop));
};

export default deleteShopController;

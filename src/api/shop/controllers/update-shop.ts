import { updateShop } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const updateShopController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { name, description, logo } = req.body;
	const userId = req.user?.id;

	if (!userId) return next(new AppError("No user found.", 404));

	const shop = await updateShop(userId, { name, description, logo });

	res.status(200).json(new APIResponse(200, "Shop updated successfully", shop));
};

export default updateShopController;

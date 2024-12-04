import { createShop } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const createShopController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { name, description, logo } = req.body;
	const userId = req.user?.id;

	if (!userId) return next(new AppError("No user found.", 404));

	const shop = await createShop({ name, description, logo, userId });

	res.status(201).json(new APIResponse(201, "Shop created successfully", shop));
};

export default createShopController;

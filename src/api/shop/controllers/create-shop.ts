import { createShop } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const createShopController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { name, description, logo } = req.body;
	const user = req.user;

	if (!user) return next(new AppError("User is not authenticated", 401));

	const shop = await createShop(user, { name, description, logo });

	res.status(201).json(new APIResponse(201, "Shop created successfully", shop));
};

export default createShopController;

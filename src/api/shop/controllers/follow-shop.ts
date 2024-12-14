import { followUnfollowShop } from "@/lib";
import { APIResponse, AppError } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const followShop = async (req: Request, res: Response, next: NextFunction) => {
	const { shopId } = req.params;
	const user = req.user;

	if (!user) return next(new AppError("User is not authenticated", 401));

	const shop = await followUnfollowShop(user, shopId);

	res
		.status(200)
		.json(new APIResponse(201, "Shop follow/unfollow successfully", shop));
};

export default followShop;

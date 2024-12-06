import { suspendUser } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const suspend = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.params.userId;

	const user = await suspendUser(userId);

	res
		.status(200)
		.json(new APIResponse(200, "Users suspended successfully", user));
};

export default suspend;

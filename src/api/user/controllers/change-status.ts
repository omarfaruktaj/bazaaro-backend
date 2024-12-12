import { UpdateUserStatus } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const changeStatus = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const userId = req.params.userId;

	const user = await UpdateUserStatus(userId);

	res
		.status(200)
		.json(
			new APIResponse(
				200,
				`User ${user.suspended ? "suspended" : "Activated"} successfully`,
				user,
			),
		);
};

export default changeStatus;

import { findAllUsers } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const findAll = async (req: Request, res: Response, next: NextFunction) => {
	const users = await findAllUsers();

	res
		.status(200)
		.json(new APIResponse(200, "Users retrieved successfully", users));
};

export default findAll;

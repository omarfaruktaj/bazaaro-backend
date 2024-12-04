import { findAllCategory } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	const category = await findAllCategory();

	res
		.status(200)
		.json(new APIResponse(200, "Category retrieve successfully", category));
};

export default getAll;

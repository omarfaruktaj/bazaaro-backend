import { findAllReview } from "@/lib/review";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	const reviews = await findAllReview();

	res
		.status(200)
		.json(new APIResponse(200, "Reviews retrieve successfully", reviews));
};

export default getAll;

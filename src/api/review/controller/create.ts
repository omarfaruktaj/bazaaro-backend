import { createReview } from "@/lib/review";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const create = async (req: Request, res: Response, next: NextFunction) => {
	const data = req.body;

	const review = await createReview(data);

	res
		.status(201)
		.json(new APIResponse(201, "Review created successfully", review));
};

export default create;

import { findAllReview } from "@/lib/review";
import { APIResponse, AppError, filterQueryParams } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	const query = filterQueryParams(req.query, [
		"page",
		"limit",
		"sort",
		"fields",
		"include",
	]);

	if (!user) return next(new AppError("You don't have permission", 401));
	const result = await findAllReview(user, query);

	res
		.status(200)
		.json(
			new APIResponse(
				200,
				"Reviews retrieve successfully",
				result?.data,
				result?.pagination,
			),
		);
};

export default getAll;

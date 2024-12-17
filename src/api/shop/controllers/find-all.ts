import { findAllShop } from "@/lib";
import { APIResponse, filterQueryParams } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const findAll = async (req: Request, res: Response, next: NextFunction) => {
	const query = filterQueryParams(req.query, [
		"page",
		"limit",
		"searchTerm",
		"sort",
		"fields",
		"include",
	]);
	const { data, pagination } = await findAllShop(query);

	res
		.status(200)
		.json(
			new APIResponse(200, "Shops retrieved successfully", data, pagination),
		);
};

export default findAll;

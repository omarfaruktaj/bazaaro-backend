import { findAllShop } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const findAll = async (req: Request, res: Response, next: NextFunction) => {
	const shops = await findAllShop();

	res
		.status(200)
		.json(new APIResponse(200, "Shops retrieved successfully", shops));
};

export default findAll;

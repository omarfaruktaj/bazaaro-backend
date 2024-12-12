import { createCategory } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const create = async (req: Request, res: Response, next: NextFunction) => {
	const { name, description } = req.body;

	try {
		const category = await createCategory({ name, description });
		res
			.status(201)
			.json(new APIResponse(201, "Category created successfully", category));
	} catch (error) {
		console.log(error);
	}
};

export default create;

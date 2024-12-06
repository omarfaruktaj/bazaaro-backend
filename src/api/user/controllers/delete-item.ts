import { deleteUser } from "@/lib";
import { APIResponse } from "@/utils";
import type { NextFunction, Request, Response } from "express";

const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.params.userId;

	const user = await deleteUser(userId);

	res.status(200).json(new APIResponse(200, "User deleted successfully", user));
};

export default deleteItem;

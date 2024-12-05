import { APIResponse } from "@/utils";
import type { RequestHandler } from "express";

const logout: RequestHandler = async (req, res, next) => {
	res.cookie("access-token", null, {
		expires: new Date(Date.now() + 1000),
		httpOnly: true,
		secure: req.secure,
	});

	res.status(200).json(new APIResponse(201, "User signout successfully"));
};

export default logout;

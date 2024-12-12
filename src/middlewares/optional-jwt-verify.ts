import { envConfig } from "@/config";
import { findUserById } from "@/lib";
import { AppError, verifyJWTToken } from "@/utils";
import type { User } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

declare module "express" {
	interface Request {
		user?: User;
	}
}

const optionalJWTVerify = async (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	let token: string | undefined;

	if (req.headers?.authorization?.startsWith("Bearer")) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) return next();

	const decoded = (await verifyJWTToken(
		token,
		envConfig.ACCESS_TOKEN_SECRET,
	)) as JwtPayload;

	const user = await findUserById(decoded.id);

	if (!user) return next(new AppError("No user found", 404));

	if (user) {
		req.user = user;
	}

	next();
};

export default optionalJWTVerify;

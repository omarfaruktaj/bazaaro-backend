import { envConfig } from "@/config";
import { findUserById } from "@/lib";
import { AppError, verifyJWTToken } from "@/utils";
import type { User, UserRoles } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

declare module "express" {
	interface Request {
		user?: User;
	}
}
const authorizeWithRoles =
	(...roles: UserRoles[]) =>
	async (req: Request, _res: Response, next: NextFunction) => {
		let token: string | undefined;

		if (req.headers?.authorization?.startsWith("Bearer")) {
			token = req.headers.authorization.split(" ")[1];
		}

		console.log(token);

		if (!token)
			return next(new AppError("Your are not logged in! Please login.", 401));

		const decoded = (await verifyJWTToken(
			token,
			envConfig.ACCESS_TOKEN_SECRET,
		)) as JwtPayload;

		const user = await findUserById(decoded.id);

		if (!user) return next(new AppError("No user found", 404));

		if (roles && !roles.includes(user.role))
			return next(
				new AppError("You do not have permission for this route", 401),
			);

		req.user = user;

		next();
	};

export default authorizeWithRoles;

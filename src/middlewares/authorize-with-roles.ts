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
		const token = req.headers?.authorization?.split(" ")[1];
		if (!token)
			return next(new AppError("Your are not logged in! Please login.", 401));

		const decoded = (await verifyJWTToken(
			token,
			envConfig.ACCESS_TOKEN_SECRET,
		)) as JwtPayload;
		const user = await findUserById(decoded.id);

		if (!user) return next(new AppError("No user found", 404));
		// if (user.changedPasswordAfter(decoded.iat as number)) {
		// 	return next(
		// 		new AppError(
		// 			"User recently changed password! Please log in again.",
		// 			401,
		// 		),
		// 	);
		// }
		if (roles && !roles.includes(user.role))
			return next(
				new AppError("You do not have permission for this route", 401),
			);

		req.user = user;

		next();
	};

export default authorizeWithRoles;

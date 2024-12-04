import { envConfig } from "@/config";
import { findUserById } from "@/lib";
import {
	APIResponse,
	AppError,
	generateJWTToken,
	verifyJWTToken,
} from "@/utils";
import type { RequestHandler } from "express";

interface DecodedToken {
	id: string;
}

const refreshAccessToken: RequestHandler = async (req, res, next) => {
	const token = req.cookies.refresh_token || req.body.refreshToken;
	if (!token) return next(new AppError("UNAUTHORIZED", 401));

	const decoded = verifyJWTToken(
		token,
		envConfig.REFRESH_TOKEN_SECRET,
	) as DecodedToken;

	const user = await findUserById(decoded.id);

	if (!user) return next(new AppError("No user found", 404));
	const accessToken = generateJWTToken(
		{ id: user.id, role: user.role },
		envConfig.ACCESS_TOKEN_SECRET,
		"15m",
	);
	const refreshToken = generateJWTToken(
		{ id: user.id, role: user.role },
		envConfig.REFRESH_TOKEN_SECRET,
		"7d",
	);

	res.status(201).json(
		new APIResponse(201, "Token refresh successfully", {
			user: user,
			accessToken,
			refreshToken,
		}),
	);
};

export default refreshAccessToken;

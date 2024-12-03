import { deleteToken, findTokenWithUser, updateUser } from "@/lib";
import { APIResponse, AppError, createHash } from "@/utils";
import { TokenType } from "@prisma/client";
import type { RequestHandler } from "express";
import crypto from "node:crypto";
import type { ResetPasswordSchemaType } from "../schemas";

const resetPassword: RequestHandler = async (req, res, next) => {
	const { password } = req.body as ResetPasswordSchemaType;
	const token = req.params.resetToken;

	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

	const tokenRecord = await findTokenWithUser(hashedToken);

	if (!tokenRecord || tokenRecord.type !== TokenType.PASSWORD_RESET) {
		return next(new AppError("Invalid token", 400));
	}
	const now = new Date();

	if (tokenRecord.createdAt < now) {
		await deleteToken(tokenRecord.id);
		return next(new AppError("Token has expired", 400));
	}
	const hashedPassword = await createHash(password);
	await updateUser({ userId: tokenRecord.user.id, password: hashedPassword });
	await deleteToken(tokenRecord.id);

	res.status(200).json(new APIResponse(200, "Password reset successfully"));
};

export default resetPassword;

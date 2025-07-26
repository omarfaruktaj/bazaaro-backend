import { envConfig } from "@/config";
import { findUserByEmail } from "@/lib";
import { APIResponse, AppError, compareHash, generateJWTToken } from "@/utils";
import type { RequestHandler } from "express";
import type { loginSchemaType } from "../schemas";

const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body as loginSchemaType;

  const existingUser = await findUserByEmail(email);

  if (!existingUser || existingUser.deletedAt) {
    return next(new AppError("Invalid credentials", 400));
  }

  const isPasswordCorrect = await compareHash(password, existingUser.password);
  if (!isPasswordCorrect) {
    return next(new AppError("Invalid credentials", 400));
  }

  if (existingUser.suspended) {
    return next(new AppError("User account has been suspended", 400));
  }

  // logger.info(`User logged in: ${existingUser.email}`);
  const accessToken = generateJWTToken(
    { id: existingUser.id, role: existingUser.role },
    envConfig.ACCESS_TOKEN_SECRET,
    envConfig.ACCESS_TOKEN_EXPIRE as any
  );
  const refreshToken = generateJWTToken(
    { id: existingUser.id, role: existingUser.role },
    envConfig.REFRESH_TOKEN_SECRET,
    envConfig.REFRESH_TOKEN_EXPIRE as any
  );

  res.cookie("refresh_token", accessToken, {
    expires: new Date(
      Date.now() + envConfig.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure,
  });

  res.status(200).json(
    new APIResponse(201, "User login successfully", {
      user: existingUser,
      accessToken,
      refreshToken,
    })
  );
};

export default login;

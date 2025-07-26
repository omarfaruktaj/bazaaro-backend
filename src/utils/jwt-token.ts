import type { UserRoles } from "@prisma/client";
import jwt, { Secret, SignOptions, Algorithm } from "jsonwebtoken";

interface Payload {
  id: string;
  role: UserRoles;
}

export const generateJWTToken = (
  payload: Payload,
  secret: Secret,
  expiresIn: SignOptions["expiresIn"] = "1h",
  algorithm: Algorithm = "HS256"
) => {
  const options: SignOptions = {
    expiresIn,
    algorithm,
  };
  return jwt.sign(payload, secret, options);
};

export const verifyJWTToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

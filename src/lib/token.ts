import { db } from "@/config";
import type { TokenType } from "@prisma/client";

interface TokenInfo {
	token: string;
	type: TokenType;
	userId: string;
	expireAt: Date;
}

export const createToken = async ({
	token,
	type,
	userId,
	expireAt,
}: TokenInfo) => {
	return await db.token.create({
		data: {
			token,
			type,
			userId,
			expireAt,
		},
	});
};

export const deleteToken = async (id: string) => {
	return await db.token.delete({
		where: {
			id,
		},
	});
};

export const findTokenWithUser = async (token: string) => {
	return await db.token.findUnique({
		where: {
			token,
		},
		include: { user: true },
	});
};

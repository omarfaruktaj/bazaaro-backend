import type { RegisterSchemaType } from "@/api/auth/schemas";
import db from "@/config/db";
import { AppError, QueryBuilder, compareHash, createHash } from "@/utils";
import { type Profile, TokenType, type User, UserRoles } from "@prisma/client";
import crypto from "node:crypto";
import { deleteToken, findTokenWithUser } from "./token";

export const findUserByEmail = (email: string) => {
	return db.user.findUnique({
		where: {
			email,
			deletedAt: null,
		},
	});
};

export const findUserById = async (id: string) => {
	return await db.user.findUnique({
		where: {
			id,
			deletedAt: null,
		},
	});
};

export const createUser = async ({
	name,
	email,
	password,
	role = UserRoles.CUSTOMER,
}: RegisterSchemaType) => {
	const isExistedUser = await db.user.findUnique({
		where: {
			email,
		},
	});

	if (isExistedUser) throw new AppError("Email already registered.", 400);
	const hashedPassword = await createHash(password);

	if (role === UserRoles.VENDOR) {
		const user = await db.user.create({
			data: {
				email,
				role,
				password: hashedPassword,
			},
		});

		return user;
	}

	if (!name) throw new AppError("Name is required.", 400);

	const user = await db.user.create({
		data: {
			email,
			role,
			password: hashedPassword,

			profile: {
				create: {
					name,
				},
			},
		},
	});

	return user;
};

interface UserUpdate {
	userId: string;
	email?: string;
	password?: string;
	role?: UserRoles;
}

export const changeUserPassword = async (
	userId: string,
	currentPassword: string,
	newPassword: string,
) => {
	const user = await findUserById(userId);

	if (!user) throw new AppError("No user found.", 404);

	const isPasswordCorrect = await compareHash(currentPassword, user.password);

	if (!isPasswordCorrect)
		throw new AppError("Your current password is wrong.", 400);

	const hashedPassword = await createHash(newPassword);

	const updatedUser = db.user.update({
		where: {
			id: user.id,
		},
		data: {
			password: hashedPassword,
		},
	});

	return updatedUser;
};

export const resetPasswordService = async (token: string, password: string) => {
	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

	const tokenRecord = await findTokenWithUser(hashedToken);

	if (!tokenRecord || tokenRecord.type !== TokenType.PASSWORD_RESET) {
		throw new AppError("Invalid token", 400);
	}

	const now = new Date();

	if (tokenRecord.createdAt < now) {
		await deleteToken(tokenRecord.id);
		throw new AppError("Token has expired", 400);
	}

	const hashedPassword = await createHash(password);
	const updatedUser = await db.user.update({
		where: {
			id: tokenRecord.user.id,
		},
		data: {
			password: hashedPassword,
		},
	});
	await deleteToken(tokenRecord.id);

	return updatedUser;
};

export const findAllUsers = async (query: Record<string, unknown>) => {
	const queryBuilder = new QueryBuilder("user", query);

	const data = await queryBuilder
		.search(["email"])
		.filter()
		.sort()
		.paginate()
		.fields()
		.include(["profile"])
		.execute();
	const pagination = await queryBuilder.countTotal();

	return {
		data,
		pagination,
	};
};

export const UpdateUserStatus = async (userId: string) => {
	const user = await db.user.findUnique({
		where: {
			id: userId,
			deletedAt: null,
		},
	});

	if (!user) throw new AppError("No user found", 404);

	const updatedStatus = user.suspended ? null : new Date();

	const updatedUser = await db.$transaction(async (prisma) => {
		const updatedUser = await db.user.update({
			where: {
				id: userId,
			},
			data: {
				suspended: updatedStatus,
			},
		});
		if (user.role === UserRoles.VENDOR) {
			await db.shop.update({
				where: {
					userId: user.id,
				},
				data: {
					isBlacklisted: !!updatedStatus,
				},
			});
		}

		return updatedUser;
	});

	return updatedUser;
};

export const deleteUser = async (userId: string) => {
	const user = await db.user.findUnique({
		where: {
			id: userId,
			deletedAt: null,
		},
	});

	if (!user) throw new AppError("No user found", 404);

	return db.user.update({
		where: {
			id: userId,
		},
		data: {
			deletedAt: new Date(),
		},
	});
};

export const getMe = (userId: string) => {
	return db.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			profile: true,
		},
	});
};

export const updateMyProfile = async (
	user: User,
	{ name, address, avatar, bio, phone }: Profile,
) => {
	const profile = await db.profile.findUnique({
		where: {
			userId: user.id,
		},
	});

	if (!profile) throw new AppError("No profile found", 404);

	const updatedProfile = await db.profile.update({
		where: {
			id: profile.id,
		},
		data: {
			name,
			address,
			avatar,
			bio,
			phone,
		},
	});

	return updateMyProfile;
};

import type { RegisterSchemaType } from "@/api/auth/schemas";
import db from "@/config/db";
import { UserRoles } from "@prisma/client";

export const findUserByEmail = (email: string) => {
	return db.user.findUnique({
		where: {
			email,
		},
	});
};

export const findUserById = async (id: string) => {
	return await db.user.findUnique({
		where: {
			id,
		},
	});
};

export const createUser = ({
	name,
	email,
	password,
	role = UserRoles.CUSTOMER,
}: RegisterSchemaType) => {
	return db.user.create({
		data: {
			email,
			password,
			role,
			profile: {
				create: {
					name,
				},
			},
		},
		select: {
			id: true,
			email: true,
			role: true,
		},
	});
};

interface UserUpdate {
	userId: string;
	email?: string;
	password?: string;
	role?: UserRoles;
}

export const updateUser = ({ userId, email, password, role }: UserUpdate) => {
	return db.user.update({
		where: {
			id: userId,
		},
		data: {
			email,
			password,
			role,
		},
	});
};

import type { User } from "@prisma/client";

declare module "express" {
	interface Request {
		user?: User;
	}
}
export type IPaginationOptions = {
	page?: number;
	limit?: number;
	sortBy?: string | undefined;
	sortOrder?: string | undefined;
};

import { db } from "@/config";
import type { Prisma, PrismaClient } from "@prisma/client";

class QueryBuilder<T> {
	private db: PrismaClient;
	private where: Record<string, any> = {};
	private orderBy: Record<string, Prisma.SortOrder>[] | undefined;
	private pagination: { skip: number; take: number } | undefined;
	private selectFields: Record<string, unknown> | undefined;

	constructor(
		public model: keyof PrismaClient,
		public query: Record<string, any>,
	) {
		this.db = db;
		this.model = model;
		this.query = query;
	}

	search(searchableFields: string[]) {
		const searchTerm = this.query?.searchTerm as string | undefined;
		if (searchTerm) {
			this.where.OR = searchableFields.map((field) => {
				if (field.includes(".")) {
					// Handle related models (e.g., "category.name")
					const [model, fieldName] = field.split(".");
					return {
						[model]: {
							[fieldName]: {
								contains: searchTerm,
								mode: "insensitive",
							},
						},
					};
				}
				return {
					[field]: { contains: searchTerm, mode: "insensitive" },
				};
			});
		}
		return this;
	}

	filter() {
		const excludeFields = ["searchTerm", "sort", "page", "limit", "fields"];
		const filters = Object.fromEntries(
			Object.entries(this.query).filter(
				([key]) => !excludeFields.includes(key),
			),
		);

		this.where = { ...this.where, ...filters };
		return this;
	}

	sort() {
		const sortParam = this.query?.sort as string | undefined;

		if (sortParam) {
			this.orderBy = sortParam.split(",").reduce(
				(acc, field) => {
					const fieldName = field.replace("-", "");
					acc.push({ [fieldName]: field.startsWith("-") ? "desc" : "asc" });
					return acc;
				},
				[] as Record<string, Prisma.SortOrder>[],
			);

			console.log("Order by: ", this.orderBy);
		} else {
			this.orderBy = [{ createdAt: "desc" }]; // Default sort
		}
		return this;
	}

	// Pagination functionality
	paginate() {
		const limit = Number(this.query?.limit) || 10;
		const page = Number(this.query?.page) || 1;
		this.pagination = {
			skip: (page - 1) * limit,
			take: limit,
		};
		return this;
	}

	// Exclude fields from response
	fields(fields: string[]) {
		let fieldsParam = fields.join(",");

		if (this.query?.fields) {
			fieldsParam = this.query?.fields;
		}

		if (fieldsParam) {
			this.selectFields = fieldsParam.split(",").reduce(
				(acc, field) => {
					const parts = field.trim().split(".");

					if (parts.length === 2) {
						const [model, fieldName] = parts;
						if (!acc[model]) {
							acc[model] = { select: {} };
						}
						(acc[model] as any).select[fieldName] = true;
					} else {
						acc[parts[0]] = true;
					}
					return acc;
				},
				{} as Record<string, unknown>,
			);
		}
		return this;
	}

	async execute() {
		const modelInstance = this.db[this.model as keyof typeof this.db];
		//@ts-expect-error
		return await modelInstance.findMany({
			where: this.where,
			orderBy: this.orderBy,
			...this.pagination,
			select: this.selectFields,
		});
	}

	async countTotal() {
		const modelInstance = this.db[this.model as keyof typeof this.db];
		//@ts-expect-error
		const total = await modelInstance.count({ where: this.where });
		const limit = Number(this.query?.limit) || 10;
		const page = Number(this.query?.page) || 1;

		const totalPage = Math.ceil(total / limit);
		const prevPage = page > 1 ? page - 1 : null;
		const nextPage = page < totalPage ? page + 1 : null;

		return {
			page,
			limit,
			totalPage,
			prevPage,
			nextPage,
			totalItem: total,
		};
	}
}

export default QueryBuilder;

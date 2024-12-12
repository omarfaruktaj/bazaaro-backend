import { FilterBuilder } from "./filter-builder";

type PrismaModelDelegate = {
	findMany: (args?: any) => Promise<any>;
	findUnique?: (args?: any) => Promise<any>;
	create?: (args: any) => Promise<any>;
	update?: (args: any) => Promise<any>;
	delete?: (args: any) => Promise<any>;
};

type QueryParams = Record<string, any>;

export class QueryBuilder<T> {
	private model: PrismaModelDelegate;
	private filters: Record<string, any> = {};
	private orderBy: Record<string, any> = {};
	private pagination: { skip?: number; take?: number } = {};

	constructor(model: PrismaModelDelegate) {
		this.model = model;
	}

	parseQuery(queryParams: QueryParams, searchableFields: string[] = []) {
		const { sort, order, page, limit, search, ...filters } = queryParams;

		this.applyFilters(filters);

		if (search && searchableFields.length > 0) {
			this.applySearch(search as string, searchableFields);
		}

		this.applySorting(sort as string, (order as "asc" | "desc") || "asc");

		this.applyPagination(page as string, limit as string);

		return this;
	}

	private applyFilters(filters: Record<string, any>) {
		const filterBuilder = new FilterBuilder();

		for (const [key, value] of Object.entries(filters)) {
			if (typeof value === "string") {
				filterBuilder.exact(key, value);
			} else if (Array.isArray(value)) {
				filterBuilder.partial(key, value[0]);
			}
		}

		this.filters = filterBuilder.build();
	}

	private applySearch(searchTerm: string, searchableFields: string[]) {
		this.filters = {
			...this.filters,
			OR: searchableFields.map((field) => ({
				[field]: { contains: searchTerm, mode: "insensitive" },
			})),
		};
	}

	private applySorting(
		sortField = "createdAt",
		sortOrder: "asc" | "desc" = "asc",
	) {
		if (sortField) {
			this.orderBy = { [sortField]: sortOrder };
		}
	}

	private applyPagination(page = "1", limit = "10") {
		const take = Number.parseInt(limit, 10);
		const skip = (Number.parseInt(page, 10) - 1) * take;
		this.pagination = { skip, take };
	}

	async execute() {
		return this.model.findMany({
			where: this.filters,
			orderBy: this.orderBy,
			...this.pagination,
		});
	}
}

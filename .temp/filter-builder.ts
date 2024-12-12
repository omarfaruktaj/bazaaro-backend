export class FilterBuilder {
	private filters: Record<string, any> = {};

	exact(field: string, value: any) {
		this.filters[field] = value;
		return this;
	}

	partial(field: string, value: string) {
		this.filters[field] = { contains: value, mode: "insensitive" };
		return this;
	}

	build() {
		return this.filters;
	}
}

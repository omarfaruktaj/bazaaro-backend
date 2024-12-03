interface Pagination {
	page: number;
	totalPage: number;
	limit: number;
	next?: number;
	prev?: number;
	totalItem: number;
}

interface Links {
	self: string;
	next?: string;
	prev?: string;
	[key: string]: string | undefined;
}

interface Errors {
	path: string;
	message: string;
}

export class APIResponse<T> {
	public status: "success" | "error";
	public code: number;
	public message: string;
	public data: T | null;
	public pagination?: Pagination | null;
	public links?: Links | null;
	public errors?: Errors[] | null;
	public timestamp: string;

	constructor(
		code: number,
		message: string,
		data: T | null = null,
		pagination?: Pagination | null,
		links?: Links | null,
		errors?: Errors[] | null,
	) {
		this.code = code;
		this.message = message;
		this.data = data;
		this.pagination = pagination || null;
		this.links = links || null;
		this.errors = errors || null;
		this.status = code >= 200 && code < 300 ? "success" : "error";
		this.timestamp = new Date().toISOString();
	}
	toJSON() {
		return {
			status: this.status,
			code: this.code,
			message: this.message,
			data: this.data,
			pagination: this.pagination,
			links: this.links,
			errors: this.errors,
			timestamp: this.timestamp,
		};
	}
}

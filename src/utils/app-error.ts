interface Errors {
	path: string;
	message: string;
}

export class AppError extends Error {
	public readonly status: string;
	public readonly code: number;
	public readonly isOperational: boolean;
	public readonly errors?: Errors[];

	constructor(message: string, code: number, errors?: Errors[]) {
		super(message);

		Object.setPrototypeOf(this, new.target.prototype);

		this.code = code;
		this.status = `${code}`.startsWith("4") ? "fail" : "error";
		this.errors = errors;
		this.isOperational = true;

		Error.captureStackTrace(this);
	}
}

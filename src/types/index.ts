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
export interface PaymentIntent {
	id: string;
	object: "payment_intent";
	amount: number;
	amount_details: {
		tip: Record<string, unknown>;
	};
	automatic_payment_methods: unknown | null;
	canceled_at: number | null;
	cancellation_reason: string | null;
	capture_method: "automatic_async" | "automatic" | "manual";
	client_secret: string;
	confirmation_method: "automatic" | "manual";
	created: number;
	currency: string;
	description: string | null;
	last_payment_error: string | null;
	livemode: boolean;
	next_action: unknown | null;
	payment_method: string;
	payment_method_configuration_details: unknown | null;
	payment_method_types: string[];
	processing: unknown | null;
	receipt_email: string | null;
	setup_future_usage: unknown | null;
	shipping: unknown | null;
	source: unknown | null;
	status:
		| "succeeded"
		| "requires_payment_method"
		| "requires_confirmation"
		| "requires_action"
		| "canceled";
}

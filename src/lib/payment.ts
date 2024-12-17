import { db, envConfig } from "@/config";
import { AppError, QueryBuilder } from "@/utils";
import type { User } from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(envConfig.STRIPE_SECRET_KEY, {
	apiVersion: "2024-11-20.acacia",
});

export const createPaymentIntent = async (user: User) => {
	const cart = await db.cart.findFirst({
		where: {
			userId: user.id,
		},
		include: {
			cartItems: {
				include: {
					product: true,
				},
			},
		},
	});

	if (!cart) throw new AppError("No cart found", 404);

	const paymentIntent = await stripe.paymentIntents.create({
		amount: Math.round(cart.totalPrice * 100),
		currency: "usd",
		payment_method_types: ["card"],
	});

	return paymentIntent.client_secret;
};

export const findAllPayments = async (query: Record<string, unknown>) => {
	const queryBuilder = new QueryBuilder("payment", query);
	db.payment;
	const data = await queryBuilder
		.filter()
		.sort()
		.paginate()
		.include()
		.fields()
		.execute();
	const pagination = await queryBuilder.countTotal();

	return {
		data,
		pagination,
	};
};

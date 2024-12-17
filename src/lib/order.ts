import { db } from "@/config";
import type { PaymentIntent } from "@/types";
import { AppError, QueryBuilder } from "@/utils";
import { OrderStatus, type User, UserRoles } from "@prisma/client";

export const getOrders = async (user: User, query: Record<string, unknown>) => {
	if (user.role === UserRoles.CUSTOMER) {
		const queryBuilder = new QueryBuilder("order", query);

		const data = await queryBuilder
			.filter({ userId: user.id })
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
	}

	if (user.role === UserRoles.VENDOR) {
		const shop = await db.shop.findUnique({
			where: {
				userId: user.id,
			},
		});

		if (!shop) throw new AppError("No shop found", 404);
		const queryBuilder = new QueryBuilder("order", query);

		const data = await queryBuilder
			.filter({ shopId: shop.id })
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
	}
	if (user.role === UserRoles.ADMIN) {
		const queryBuilder = new QueryBuilder("order", query);

		const data = await queryBuilder
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
	}
};

export const createOrder = async (user: User, paymentData?: PaymentIntent) => {
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

	const newOrder = await db.$transaction(async (tx) => {
		const order = await tx.order.create({
			data: {
				totalAmount: cart.totalPrice,
				discount: cart.discount,
				shopId: cart.shopId,
				userId: user.id,
				status: OrderStatus.PENDING,
			},
		});

		const orderItems = cart?.cartItems.map((item) => {
			return {
				productId: item.productId,
				quantity: item.quantity,
				price: item.product.price,
				orderId: order.id,
			};
		});

		await tx.orderItem.createMany({
			data: orderItems,
		});

		for (const item of cart.cartItems) {
			await tx.product.update({
				where: { id: item.productId },
				data: {
					quantity: {
						decrement: item.quantity,
					},
				},
			});
		}

		if (paymentData) {
			await tx.payment.create({
				data: {
					amount: Number(paymentData.amount) / 100,
					transactionId: paymentData.id,
					userId: user.id,
					orderId: order.id,
					paymentStatus: "PAID",
					paymentMethod: "STRIPE",
				},
			});

			await tx.order.update({
				where: {
					id: order.id,
				},
				data: {
					paymentStatus: "PAID",
					status: OrderStatus.PAID,
				},
			});
		}

		await tx.cart.update({
			where: {
				id: cart.id,
			},
			data: {
				discount: 0,
				totalPrice: 0,
				shopId: undefined,
				cartItems: undefined,
			},
		});
		await tx.cartItem.deleteMany({
			where: {
				cartId: cart.id,
			},
		});

		return order;
	});

	const order = await db.order.findUnique({
		where: {
			id: newOrder.id,
		},
	});

	return order;
};

export const updateOrderStatus = async (
	user: User,
	orderId: string,
	data: { status: OrderStatus },
) => {
	const order = await db.order.findUnique({
		where: {
			id: orderId,
		},
		include: {
			shop: {
				include: {
					user: true,
				},
			},
		},
	});

	if (!order) throw new AppError("No order found", 404);

	if (user.id !== order.shop.user.id)
		throw new AppError("You have not permission to update order status", 401);

	const result = await db.order.update({
		where: {
			id: order.id,
		},
		data: {
			status: data.status,
		},
	});

	return result;
};

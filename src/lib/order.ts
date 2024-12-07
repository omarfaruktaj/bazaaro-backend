import { db } from "@/config";
import { AppError } from "@/utils";
import { OrderStatus, type User, UserRoles } from "@prisma/client";

export const getOrders = async (user: User) => {
	if (user.role === UserRoles.CUSTOMER) {
		return db.order.findMany({
			where: {
				userId: user.id,
			},
		});
	}

	if (user.role === UserRoles.VENDOR) {
		const shop = await db.shop.findUnique({
			where: {
				userId: user.id,
			},
		});

		if (!shop) throw new AppError("No shop found", 404);

		return db.order.findMany({
			where: {
				shopId: shop.id,
			},
		});
	}
	if (user.role === UserRoles.ADMIN) {
		return db.order.findMany();
	}
};

export const createOrder = async (user: User, discount = 0) => {
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

	const cartItems = cart.cartItems;
	const totalAmount = cart.cartItems.reduce(
		(sum, item) => sum + item.quantity * item.product.price,
		0,
	);

	const finalTotal = totalAmount - discount;

	const newOrder = await db.$transaction(async (tx) => {
		const order = await tx.order.create({
			data: {
				totalAmount,
				discount,
				finalTotal,
				shopId: cart.shopId,
				userId: user.id,
				status: OrderStatus.PENDING,
			},
		});

		const orderItems = cartItems.map((item) => {
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

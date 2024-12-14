import { db } from "@/config";
import { AppError } from "@/utils";
import type { User } from "@prisma/client";

interface AddProductToCartData {
	shopId: string;
	productId: string;
	quantity: number;
}
export const getCart = async (user: User) => {
	const cart = await db.cart.findFirst({
		where: {
			userId: user.id,
		},
		include: {
			cartItems: {
				include: {
					product: true,
				},
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	if (!cart) throw new AppError("Cart not found", 404);
	return cart;
};

export const addProductToCart = async (
	user: User,
	{ productId, quantity = 1 }: AddProductToCartData,
) => {
	const product = await db.product.findUnique({
		where: {
			id: productId,
		},
		include: {
			shop: true,
		},
	});

	if (!product) throw new AppError("No product found", 400);

	if (product.quantity < quantity)
		throw new AppError("Insufficient stock for the requested quantity", 400);

	const cart = await db.cart.findFirst({
		where: {
			userId: user.id,
		},
		include: {
			cartItems: true,
		},
	});

	if (!cart) {
		const cartData = await db.cart.create({
			data: {
				shopId: product.shopId,
				userId: user.id,
				cartItems: {
					create: {
						productId,
						quantity,
					},
				},
			},
		});

		return cartData;
	}

	if (cart.shopId !== product.shopId) {
		await db.cartItem.deleteMany({
			where: {
				cartId: cart.id,
			},
		});
		await db.cart.update({
			where: { id: cart.id },
			data: {
				shopId: product.shop.id,
				cartItems: {
					create: {
						productId: product.id,
						quantity,
					},
				},
			},
		});

		return cart;
	}

	const existingCartItem = await db.cartItem.findFirst({
		where: {
			cartId: cart.id,
			productId: product.id,
		},
	});

	if (existingCartItem) {
		await db.cartItem.update({
			where: {
				id: existingCartItem.id,
			},
			data: {
				quantity: existingCartItem.quantity + quantity,
			},
		});

		return cart;
	}

	// if (cart.shopId !== shopId) {
	// 	const cartData = await db.cart.create({
	// 		data: {
	// 			shopId,
	// 			userId: user.id,
	// 			cartItems: {
	// 				create: {
	// 					productId,
	// 					quantity,
	// 				},
	// 			},
	// 		},
	// 	});

	// 	return cartData;
	// }

	await db.cartItem.create({
		data: {
			cartId: cart.id,
			productId: product.id,
			quantity: quantity,
		},
	});

	return cart;
};
export const updateCartItemQuantity = async (
	cartItemId: string,
	quantity: number,
) => {
	const cartItem = await db.cartItem.findUnique({
		where: {
			id: cartItemId,
		},
	});

	if (!cartItem) throw new AppError("Cart item not found", 400);

	const product = await db.product.findUnique({
		where: { id: cartItem.productId },
	});

	if (!product || product.quantity < quantity) {
		throw new AppError("Insufficient stock for the requested quantity", 400);
	}

	await db.cartItem.update({
		where: {
			id: cartItemId,
		},
		data: {
			quantity,
		},
	});
};

export const deleteCartItem = async (cartItemId: string) => {
	const cartItem = await db.cartItem.findUnique({
		where: {
			id: cartItemId,
		},
	});

	if (!cartItem) throw new AppError("Cart item not found", 400);

	const deletedCartItem = await db.cartItem.delete({
		where: { id: cartItemId },
	});
	return deletedCartItem;
};

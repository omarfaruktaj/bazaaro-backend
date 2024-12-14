import { db } from "@/config";
import { AppError } from "@/utils";
import type { Product, User } from "@prisma/client";

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
const calculateProductPrice = (product: Product, quantity: number) => {
	const price = product.price * quantity;
	const discount = product.discount || 0;
	const discountAmount = (price * discount) / 100;
	return price - discountAmount;
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
				totalPrice: calculateProductPrice(product, quantity),
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
				totalPrice: calculateProductPrice(product, quantity),
			},
		});

		return cart;
	}

	const productPrice = calculateProductPrice(product, quantity);

	const existingCartItem = await db.cartItem.findFirst({
		where: {
			cartId: cart.id,
			productId: product.id,
		},
	});

	let newTotalPrice = cart.totalPrice;

	if (existingCartItem) {
		newTotalPrice += productPrice;
		await db.cartItem.update({
			where: {
				id: existingCartItem.id,
			},
			data: {
				quantity: existingCartItem.quantity + quantity,
			},
		});
	} else {
		newTotalPrice += productPrice;
		await db.cartItem.create({
			data: {
				cartId: cart.id,
				productId: product.id,
				quantity: quantity,
			},
		});
	}

	await db.cart.update({
		where: { id: cart.id },
		data: { totalPrice: newTotalPrice },
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
		include: {
			product: true,
		},
	});

	if (!cartItem) throw new AppError("Cart item not found", 400);

	const product = cartItem.product;

	if (product.quantity < quantity) {
		throw new AppError("Insufficient stock for the requested quantity", 400);
	}

	const cart = await db.cart.findUnique({
		where: { id: cartItem.cartId },
		include: {
			cartItems: true,
		},
	});

	if (!cart) throw new AppError("Cart not found", 404);

	const oldItemPrice = calculateProductPrice(product, cartItem.quantity);

	const newItemPrice = calculateProductPrice(product, quantity);

	await db.cartItem.update({
		where: {
			id: cartItemId,
		},
		data: {
			quantity,
		},
	});

	const priceDifference = newItemPrice - oldItemPrice;

	const newTotalPrice = cart.totalPrice + priceDifference;

	await db.cart.update({
		where: { id: cart.id },
		data: { totalPrice: newTotalPrice },
	});

	return newTotalPrice;
};

export const deleteCartItem = async (cartItemId: string) => {
	const cartItem = await db.cartItem.findUnique({
		where: {
			id: cartItemId,
		},
		include: {
			product: true,
		},
	});

	if (!cartItem) throw new AppError("Cart item not found", 400);

	const product = cartItem.product;
	const itemPrice = calculateProductPrice(product, cartItem.quantity);

	const deletedCartItem = await db.cartItem.delete({
		where: { id: cartItemId },
	});

	const cart = await db.cart.findUnique({
		where: { id: cartItem.cartId },
	});

	if (!cart) throw new AppError("Cart not found", 400);

	const newTotalPrice = cart.totalPrice - itemPrice;

	await db.cart.update({
		where: { id: cart.id },
		data: { totalPrice: newTotalPrice },
	});

	return deletedCartItem;
};

import type { CouponSchemaType } from "@/api/coupon/schemas";
import { db } from "@/config";
import { AppError } from "@/utils";
import type { User } from "@prisma/client";

export const getCoupons = async (user: User) => {
	const shop = await db.shop.findUnique({
		where: {
			userId: user.id,
			isBlacklisted: false,
		},
	});

	if (!shop) throw new AppError("No shop found", 404);

	const result = await db.coupon.findMany({
		where: {
			shopId: shop.id,
		},
	});

	return result;
};

export const createCoupon = async (
	user: User,
	{ code, discountType, discountValue, endDate, startDate }: CouponSchemaType,
) => {
	const shop = await db.shop.findUnique({
		where: {
			userId: user.id,
			isBlacklisted: false,
		},
	});

	if (!shop) throw new AppError("No shop found", 404);

	const existedCoupon = await db.coupon.findUnique({
		where: {
			code_shopId: {
				code,
				shopId: shop.id,
			},
		},
	});

	if (existedCoupon) throw new AppError("Coupon code is already exist", 400);

	const coupon = await db.coupon.create({
		data: {
			code,
			discountType,
			discountValue,
			endDate,
			startDate,
			shopId: shop.id,
		},
	});

	return coupon;
};

export const updateCoupon = async (
	user: User,
	couponId: string,
	{ code, discountType, discountValue, endDate, startDate }: CouponSchemaType,
) => {
	const existedCoupon = await db.coupon.findUnique({
		where: {
			id: couponId,
		},
	});

	if (!existedCoupon) throw new AppError("Coupon not found", 400);

	const shop = await db.shop.findUnique({
		where: {
			userId: user.id,
			isBlacklisted: false,
		},
	});

	if (!shop) throw new AppError("No shop found", 404);

	if (existedCoupon.shopId !== shop.id)
		throw new AppError("You have not permission to update this coupon", 401);

	const updatedCoupon = await db.coupon.update({
		where: {
			id: existedCoupon.id,
		},
		data: {
			code,
			discountType,
			discountValue,
			endDate,
			startDate,
		},
	});

	return updatedCoupon;
};

export const deleteCoupon = async (user: User, couponId: string) => {
	const existedCoupon = await db.coupon.findUnique({
		where: {
			id: couponId,
		},
	});

	if (!existedCoupon) throw new AppError("Coupon not found", 400);

	const shop = await db.shop.findUnique({
		where: {
			userId: user.id,
			isBlacklisted: false,
		},
	});

	if (!shop) throw new AppError("No shop found", 404);

	if (existedCoupon.shopId !== shop.id)
		throw new AppError("You have not permission to delete this coupon", 401);

	const result = await db.coupon.delete({
		where: {
			id: couponId,
		},
	});

	return result;
};

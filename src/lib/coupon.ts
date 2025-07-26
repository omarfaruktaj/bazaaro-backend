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
  { code, discountType, discountValue, endDate, startDate }: CouponSchemaType
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
  { code, discountType, discountValue, endDate, startDate }: CouponSchemaType
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
export const applyCoupon = async (
  user: User,
  couponCode: string,
  shopId: string
) => {
  const existedCoupon = await db.coupon.findUnique({
    where: {
      code: couponCode,
    },
  });

  if (!existedCoupon) throw new AppError("Invalid Coupon code", 400);
  const currentDate = new Date();

  if (existedCoupon.startDate > currentDate) {
    throw new AppError("Coupon is not yet valid", 400);
  }

  if (existedCoupon.endDate && existedCoupon.endDate < currentDate) {
    throw new AppError("Coupon has expired", 400);
  }

  const shop = await db.shop.findUnique({
    where: {
      id: existedCoupon.shopId,
    },
  });

  if (!shop) throw new AppError("Invalid Coupon code", 404);

  // const cart = await db.cart.findFirst({
  //   where: {
  //     userId: user.id,
  //   },
  //   include: {
  //     cartItems: {
  //       include: {
  //         product: true,
  //       },
  //     },
  //   },
  // });

  // if (!cart) throw new AppError("User does not have a cart", 404);

  if (shopId !== existedCoupon.shopId)
    throw new AppError("Coupon is not valid for the current shop", 400);

  // const totalCartPrice =
  //   cart.cartItems?.reduce((total, item) => {
  //     const discountedPrice = item.product.discount
  //       ? item.product.price -
  //         (item.product.price * item.product.discount) / 100
  //       : item.product.price;
  //     return total + discountedPrice * item.quantity;
  //   }, 0) || 0;

  // let discountAmount = 0;

  // if (existedCoupon.discountType === "PERCENTAGE") {
  //   discountAmount = (totalCartPrice * existedCoupon.discountValue) / 100;
  // } else if (existedCoupon.discountType === "FIXED") {
  //   discountAmount = existedCoupon.discountValue;
  // }

  // discountAmount = Math.min(discountAmount, totalCartPrice);

  // const newTotalPrice = totalCartPrice - discountAmount;

  // await db.cart.update({
  //   where: { id: cart.id },
  //   data: { totalPrice: newTotalPrice, discount: discountAmount },
  // });

  return {
    coupon: existedCoupon,
    // totalPrice: newTotalPrice,
    // discount: discountAmount,
    message: "Coupon applied successfully",
  };
};

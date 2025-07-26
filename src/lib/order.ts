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

type CreateOrderType = {
  user: User;
  cartItems: CartItems;
  couponCode: string | null;
  paymentData?: PaymentIntent;
};
type CartItems = {
  productId: string;
  quantity: number;
}[];
export const createOrder = async ({
  user,
  cartItems,
  couponCode,
  paymentData,
}: CreateOrderType) => {
  // Fetch product details
  const products = await db.product.findMany({
    where: {
      id: {
        in: cartItems.map((item) => item.productId),
      },
    },
    select: {
      id: true,
      price: true,
      quantity: true,
      discount: true,
      shopId: true,
    },
  });

  if (products.length === 0) throw new AppError("No products found", 404);

  const shop = await db.shop.findFirst({
    where: {
      id: products[0].shopId,
    },
  });

  if (!shop) throw new AppError("Shop not found", 404);

  // Calculate total price
  let totalPrice = 0;
  for (const product of products) {
    const cartItem = cartItems.find((item) => item.productId === product.id);
    if (!cartItem) continue;

    if (product.quantity < cartItem.quantity) {
      throw new AppError(`Insufficient stock for product ${product.id}`, 400);
    }

    const discountedPrice = product.discount
      ? product.price - (product.price * product.discount) / 100
      : product.price;

    totalPrice += discountedPrice * cartItem.quantity;
  }

  // Apply coupon
  let discountAmount = 0;

  if (couponCode) {
    const existedCoupon = await db.coupon.findUnique({
      where: { code: couponCode },
    });

    if (!existedCoupon) throw new AppError("Invalid coupon code", 400);

    const now = new Date();

    if (existedCoupon.startDate > now) {
      throw new AppError("Coupon is not yet valid", 400);
    }

    if (existedCoupon.endDate && existedCoupon.endDate < now) {
      throw new AppError("Coupon has expired", 400);
    }

    if (shop.id !== existedCoupon.shopId) {
      throw new AppError("Coupon is not valid for the current shop", 400);
    }

    if (existedCoupon.discountType === "PERCENTAGE") {
      discountAmount = (totalPrice * existedCoupon.discountValue) / 100;
    } else if (existedCoupon.discountType === "FIXED") {
      discountAmount = existedCoupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, totalPrice);
  }

  const finalAmount = totalPrice - discountAmount;

  // Create order and update inventory
  const newOrder = await db.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        totalAmount: finalAmount,
        discount: discountAmount,
        shopId: shop.id,
        userId: user.id,
        status: OrderStatus.PENDING,
        paymentStatus: paymentData ? "PAID" : "PENDING",
      },
    });

    const orderItems = cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const discountedPrice = product?.discount
        ? product.price - (product.price * product.discount) / 100
        : product?.price || 0;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: discountedPrice,
        orderId: order.id,
      };
    });

    await tx.orderItem.createMany({ data: orderItems });

    // Decrease inventory
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Handle payment
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
        where: { id: order.id },
        data: {
          status: OrderStatus.PAID,
        },
      });
    }

    return order;
  });

  const fullOrder = await db.order.findUnique({
    where: { id: newOrder.id },
    include: {
      orderItem: true,
      payment: true,
    },
  });

  return fullOrder;
};

export const updateOrderStatus = async (
  user: User,
  orderId: string,
  data: { status: OrderStatus }
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

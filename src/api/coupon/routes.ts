import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import validateRequest from "@/middlewares/validate-request";
import { UserRoles } from "@prisma/client";
import { Router } from "express";
import { createController, updateController } from "./controllers";
import { CouponSchema, UpdateCouponSchema } from "./schemas";

const router = Router();

router
	.route("/")
	.post(
		authorizeWithRoles(UserRoles.VENDOR),
		validateRequest(CouponSchema),
		createController,
	);

router
	.route("/:couponId")
	.post(
		authorizeWithRoles(UserRoles.VENDOR),
		validateRequest(UpdateCouponSchema),
		updateController,
	);

export default router;

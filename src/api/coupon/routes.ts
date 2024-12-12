import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import validateRequest from "@/middlewares/validate-request";
import { UserRoles } from "@prisma/client";
import { Router } from "express";
import {
	createController,
	deleteController,
	getAllController,
	updateController,
} from "./controllers";
import { CouponSchema, UpdateCouponSchema } from "./schemas";

const router = Router();

router
	.route("/")
	.get(authorizeWithRoles(UserRoles.VENDOR), getAllController)
	.post(
		authorizeWithRoles(UserRoles.VENDOR),
		validateRequest(CouponSchema),
		createController,
	);

router
	.route("/:couponId")
	.put(
		authorizeWithRoles(UserRoles.VENDOR),
		validateRequest(UpdateCouponSchema),
		updateController,
	)
	.delete(authorizeWithRoles(UserRoles.VENDOR), deleteController);

export default router;

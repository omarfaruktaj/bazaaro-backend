import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import validateRequest from "@/middlewares/validate-request";
import { UserRoles } from "@prisma/client";
import { Router } from "express";
import {
	createController,
	getAllController,
	updateController,
} from "./controllers";
import { OrderSchema, OrderStatusSchema } from "./schemas";

const router = Router();

router.put(
	"/:orderId/status",
	authorizeWithRoles(UserRoles.VENDOR),
	validateRequest(OrderStatusSchema),
	updateController,
);

router
	.route("/")
	.post(
		authorizeWithRoles(UserRoles.CUSTOMER),
		validateRequest(OrderSchema),
		createController,
	)
	.get(
		authorizeWithRoles(UserRoles.CUSTOMER, UserRoles.VENDOR, UserRoles.ADMIN),
		getAllController,
	);

export default router;

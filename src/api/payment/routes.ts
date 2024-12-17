import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import { Router } from "express";
import { createPaymentIntent, getAllController } from "./controller";

const router = Router();

router.post(
	"/create-payment-intent",
	authorizeWithRoles("ADMIN", "CUSTOMER", "VENDOR"),
	createPaymentIntent,
);
router
	.route("/")
	.get(authorizeWithRoles("ADMIN", "VENDOR", "CUSTOMER"), getAllController);

export default router;

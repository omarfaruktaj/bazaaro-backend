import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import validateRequest from "@/middlewares/validate-request";
import { Router } from "express";
import {
	createController,
	deleteController,
	getAllController,
	updateController,
} from "./controller";
import { ProductSchema, UpdateProductSchema } from "./schemas";

const router = Router();

router
	.route("/")
	.post(
		authorizeWithRoles("VENDOR"),
		validateRequest(ProductSchema),
		createController,
	)
	.get(getAllController);

router
	.route("/:productId")
	.put(
		authorizeWithRoles("VENDOR"),
		validateRequest(UpdateProductSchema),
		updateController,
	)
	.delete(authorizeWithRoles("ADMIN", "VENDOR"), deleteController);

export default router;

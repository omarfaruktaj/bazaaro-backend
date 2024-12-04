import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import validateRequest from "@/middlewares/validate-request";
import { Router } from "express";
import {
	createController,
	deleteController,
	getAllController,
	updateController,
} from "./controller";
import { CategorySchema, UpdateCategorySchema } from "./schemas";

const router = Router();

router
	.route("/")
	.post(
		authorizeWithRoles("ADMIN"),
		validateRequest(CategorySchema),
		createController,
	)
	.get(getAllController);

router
	.route("/:categoryId")
	.put(
		authorizeWithRoles("ADMIN"),
		validateRequest(UpdateCategorySchema),
		updateController,
	)
	.delete(authorizeWithRoles("ADMIN"), deleteController);

export default router;

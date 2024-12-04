import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import validateRequest from "@/middlewares/validate-request";
import { Router } from "express";
import {
	createController,
	deleteController,
	getAllController,
	updateController,
} from "./controller";
import { ReviewSchema, UpdateReviewSchema } from "./schemas";

const router = Router();

router
	.route("/")
	.post(
		authorizeWithRoles("CUSTOMER"),
		validateRequest(ReviewSchema),
		createController,
	)
	.get(getAllController);

router
	.route("/:reviewId")
	.put(
		authorizeWithRoles("CUSTOMER"),
		validateRequest(UpdateReviewSchema),
		updateController,
	)
	.delete(authorizeWithRoles("ADMIN", "CUSTOMER"), deleteController);

export default router;

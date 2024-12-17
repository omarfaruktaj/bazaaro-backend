import authorizeWithRoles from "@/middlewares/authorize-with-roles";
import validateRequest from "@/middlewares/validate-request";
import { UserRoles } from "@prisma/client";
import { Router } from "express";
import {
	createController,
	createResponse,
	deleteController,
	deleteResponse,
	getAllController,
	updateController,
	updateResponse,
} from "./controller";
import {
	ReviewResponseSchema,
	ReviewSchema,
	UpdateReviewSchema,
} from "./schemas";

const router = Router();
router.post(
	"/:reviewId/response",
	authorizeWithRoles(UserRoles.VENDOR),
	validateRequest(ReviewResponseSchema),
	createResponse,
);
router.put(
	"/response/:responseId",
	authorizeWithRoles(UserRoles.VENDOR),
	validateRequest(ReviewResponseSchema),
	updateResponse,
);
router.delete(
	"/response/:responseId",
	authorizeWithRoles(UserRoles.VENDOR),
	deleteResponse,
);
router.post(
	"/:productId",
	authorizeWithRoles("CUSTOMER"),
	validateRequest(ReviewSchema),
	createController,
);
router
	.route("/")
	.get(authorizeWithRoles("ADMIN", "VENDOR", "CUSTOMER"), getAllController);

router
	.route("/:reviewId")
	.put(
		authorizeWithRoles("CUSTOMER"),
		validateRequest(UpdateReviewSchema),
		updateController,
	)
	.delete(authorizeWithRoles("ADMIN", "VENDOR", "CUSTOMER"), deleteController);

export default router;

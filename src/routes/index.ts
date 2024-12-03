import { resourceRoutes } from "@/api/resource";
import { Router } from "express";

const router = Router();
router.use("/", resourceRoutes);

export default router;

import { Router } from "express";
import { getDashboardStats } from "./dashboard.controller";
import { authenticateToken, requireRoles } from "../../middlewares/auth";

const router = Router();

router.get("/dashboard", authenticateToken, requireRoles(["admin", "support"]), getDashboardStats);

export default router;


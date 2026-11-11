import { Router } from "express";
import {
  placeOrder,
  trackOrder,
  getMyOrders,
  getAllOrdersAdmin,
  updateOrderStatus,
} from "./orders.controller";
import { authenticateToken, optionalAuth, requireRoles } from "../../middlewares/auth";

const router = Router();

router.post("/checkout/place-order", optionalAuth, placeOrder);
router.get("/orders/track", trackOrder);
router.get("/me/orders", authenticateToken, getMyOrders);

// Admin
router.get("/admin/orders", authenticateToken, requireRoles(["admin", "warehouse", "support"]), getAllOrdersAdmin);
router.patch("/admin/orders/:id/status", authenticateToken, requireRoles(["admin", "warehouse"]), updateOrderStatus);

export default router;


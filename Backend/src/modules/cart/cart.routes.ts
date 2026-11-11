import { Router } from "express";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "./cart.controller";
import { optionalAuth } from "../../middlewares/auth";

const router = Router();

router.use(optionalAuth);

router.get("/", getCart);
router.delete("/", clearCart);
router.post("/items", addToCart);
router.patch("/items/:id", updateCartItem);
router.delete("/items/:id", removeCartItem);

export default router;


import { Router } from "express";
import {
  getCategories,
  getBrands,
  getProducts,
  getProductBySlug,
  getSearchSuggestions,
  createProduct,
} from "./products.controller";
import { authenticateToken, requireRoles } from "../../middlewares/auth";

const router = Router();

router.get("/categories", getCategories);
router.get("/brands", getBrands);
router.get("/products", getProducts);
router.get("/products/:slug", getProductBySlug);
router.get("/search/suggest", getSearchSuggestions);

// Admin routes
router.post("/admin/products", authenticateToken, requireRoles(["admin"]), createProduct);

export default router;


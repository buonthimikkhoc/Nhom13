import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/products/products.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/orders/orders.routes";
import warrantyRoutes from "./modules/warranty/warranty.routes";
import dashboardRoutes from "./modules/admin/dashboard.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes prefix /api/v1
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1/warranty", warrantyRoutes);
app.use("/api/v1/admin", dashboardRoutes);

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    error: { code: "INTERNAL_SERVER_ERROR", message: err.message || "Đã xảy ra lỗi máy chủ." },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend API Server running on http://localhost:${PORT}`);
  console.log(`📋 API Prefix: http://localhost:${PORT}/api/v1`);
});


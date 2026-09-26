import express from "express";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { requireDb } from "./middleware/dbReady.js";
import productRoutes from "./routes/productRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import pickupSlotRoutes from "./routes/pickupSlotRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import farmerCompatRoutes from "./routes/farmerCompatRoutes.js";

const app = express();

const allowedOrigins = String(process.env.CLIENT_URL || "http://localhost:5173").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: (origin, cb) => { if (!origin || allowedOrigins.includes(origin)) return cb(null, true); return cb(new Error("Origin not allowed by CORS")); }, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ message: "MarketLink API is running", database: process.env.MONGO_URI ? "configured" : "missing" });
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/products", requireDb, productRoutes);
app.use("/api/markets", requireDb, marketRoutes);
app.use("/api/farmers", requireDb, farmerRoutes);
app.use("/api/orders", requireDb, orderRoutes);
app.use("/api/reviews", requireDb, reviewRoutes);
app.use("/api/favorites", requireDb, favoriteRoutes);
app.use("/api/notifications", requireDb, notificationRoutes);
app.use("/api/pickup-slots", requireDb, pickupSlotRoutes);
app.use("/api/categories", requireDb, categoryRoutes);
app.use("/api/announcements", requireDb, announcementRoutes);
app.use("/api/admin", requireDb, adminRoutes);
app.use("/api/users", requireDb, profileRoutes);
app.use("/api/customer", requireDb, customerRoutes);
app.use("/api/farmer", requireDb, farmerCompatRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

import "./src/config/env.js";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { ensureAdmin } from "./src/seed/ensureAdmin.js";

const PORT = Number(process.env.PORT || 5000);
const HOST = "0.0.0.0";

const boot = async () => {
  const connected = await connectDB();

  if (!connected) {
    console.error("MarketLink API not started because MongoDB is unavailable.");
    process.exitCode = 1;
    return;
  }

  try {
    await ensureAdmin();
  } catch (err) {
    console.error("Admin bootstrap failed:", err?.message || err);
    process.exitCode = 1;
    return;
  }

  app.listen(PORT, HOST, () => {
    console.log(`MarketLink API listening on http://${HOST}:${PORT}`);
  });
};

boot().catch((err) => {
  console.error("MarketLink startup failed:", err);
  process.exitCode = 1;
});
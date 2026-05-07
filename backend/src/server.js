const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");
const { authRoutes } = require("./routes/authRoutes");
const { productRoutes } = require("./routes/productRoutes");
const { uploadRoutes } = require("./routes/uploadRoutes");
const { chatRoutes } = require("./routes/chatRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 4000;

initDb();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`API ecommerce active sur http://localhost:${PORT}`);
});

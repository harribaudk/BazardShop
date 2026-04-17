const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({ storage });

router.post("/", authMiddleware, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier recu." });
  }
  return res.status(201).json({
    fileUrl: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname,
  });
});

module.exports = { uploadRoutes: router };

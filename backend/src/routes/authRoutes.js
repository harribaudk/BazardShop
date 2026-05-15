const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../db");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

router.post("/register", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Champs manquants." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Mot de passe trop court (min 6)." });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hash],
      function onInsert(error) {
        if (error) {
          return res.status(400).json({ message: "Email deja utilise." });
        }

        const user = { id: this.lastID, name, email };
        const token = signToken(user);
        return res.status(201).json({ token, user });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

router.post("/login", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password) {
    return res.status(400).json({ message: "Champs manquants." });
  }

  db.get(
    "SELECT id, name, email, password_hash FROM users WHERE email = ?",
    [email],
    async (error, user) => {
      if (error || !user) {
        return res.status(401).json({ message: "Identifiants invalides." });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ message: "Identifiants invalides." });
      }

      const token = signToken(user);
      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    }
  );
});

router.get("/me", authMiddleware, (req, res) => {
  db.get(
    "SELECT id, name, email, bio, avatar_url, created_at FROM users WHERE id = ?",
    [req.user.id],
    (error, user) => {
      if (error || !user) {
        return res.status(404).json({ message: "Utilisateur introuvable." });
      }
      return res.json(user);
    }
  );
});

router.put("/me", authMiddleware, (req, res) => {
  const name = String(req.body.name || "").trim();
  const bio = String(req.body.bio || "").trim();
  const avatar_url = String(req.body.avatar_url || "").trim();
  if (!name) {
    return res.status(400).json({ message: "Le nom est obligatoire." });
  }

  db.run(
    "UPDATE users SET name = ?, bio = ?, avatar_url = ? WHERE id = ?",
    [name || "", bio || "", avatar_url || "", req.user.id],
    function onUpdate(error) {
      if (error) {
        return res.status(500).json({ message: "Erreur lors de la mise a jour." });
      }
      return res.json({ message: "Profil mis a jour." });
    }
  );
});

module.exports = { authRoutes: router };

const express = require("express");
const { db } = require("../db");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  db.all(
    `SELECT p.*, u.name as seller_name
     FROM products p
     JOIN users u ON u.id = p.created_by
     ORDER BY p.created_at DESC`,
    [],
    (error, rows) => {
      if (error) {
        return res.status(500).json({ message: "Erreur de chargement." });
      }
      return res.json(rows);
    }
  );
});

router.get("/:id", (req, res) => {
  db.get(
    `SELECT p.*, u.name as seller_name
     FROM products p
     JOIN users u ON u.id = p.created_by
     WHERE p.id = ?`,
    [req.params.id],
    (error, row) => {
      if (error) {
        return res.status(500).json({ message: "Erreur de chargement." });
      }
      if (!row) {
        return res.status(404).json({ message: "Produit introuvable." });
      }
      return res.json(row);
    }
  );
});

router.post("/", authMiddleware, (req, res) => {
  const title = String(req.body.title || "").trim();
  const description = String(req.body.description || "").trim();
  const price = Number(req.body.price);
  const image_url = String(req.body.image_url || "").trim();
  if (!title || !description || !price) {
    return res.status(400).json({ message: "Champs manquants." });
  }
  if (price <= 0) {
    return res.status(400).json({ message: "Prix invalide." });
  }

  db.run(
    "INSERT INTO products (title, description, price, image_url, created_by) VALUES (?, ?, ?, ?, ?)",
    [title, description, price, image_url || "", req.user.id],
    function onInsert(error) {
      if (error) {
        return res.status(500).json({ message: "Creation impossible." });
      }
      return res.status(201).json({ id: this.lastID });
    }
  );
});

router.put("/:id", authMiddleware, (req, res) => {
  const title = String(req.body.title || "").trim();
  const description = String(req.body.description || "").trim();
  const price = Number(req.body.price);
  const image_url = String(req.body.image_url || "").trim();
  if (!title || !description || !price || price <= 0) {
    return res.status(400).json({ message: "Donnees invalides." });
  }
  db.run(
    `UPDATE products
     SET title = ?, description = ?, price = ?, image_url = ?
     WHERE id = ? AND created_by = ?`,
    [title, description, price, image_url || "", req.params.id, req.user.id],
    function onUpdate(error) {
      if (error) {
        return res.status(500).json({ message: "Mise a jour impossible." });
      }
      if (this.changes === 0) {
        return res.status(403).json({ message: "Action non autorisee." });
      }
      return res.json({ message: "Produit modifie." });
    }
  );
});

router.delete("/:id", authMiddleware, (req, res) => {
  db.run(
    "DELETE FROM products WHERE id = ? AND created_by = ?",
    [req.params.id, req.user.id],
    function onDelete(error) {
      if (error) {
        return res.status(500).json({ message: "Suppression impossible." });
      }
      if (this.changes === 0) {
        return res.status(403).json({ message: "Action non autorisee." });
      }
      return res.json({ message: "Produit supprime." });
    }
  );
});

module.exports = { productRoutes: router };

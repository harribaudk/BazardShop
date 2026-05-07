const express = require("express");
const { db } = require("../db");
const { authMiddleware } = require("../middleware/auth");
const { emitToUser } = require("../realtime");

const router = express.Router();

router.get("/users", authMiddleware, (req, res) => {
  db.all(
    `SELECT id, name, email FROM users WHERE id != ? ORDER BY name ASC`,
    [req.user.id],
    (error, rows) => {
      if (error) {
        return res.status(500).json({ message: "Erreur de chargement." });
      }
      return res.json(rows);
    }
  );
});

router.get("/conversations", authMiddleware, (req, res) => {
  const userId = req.user.id;
  db.all(
    `SELECT u.id, u.name, u.email,
            (SELECT content FROM messages
             WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id)
             ORDER BY created_at DESC LIMIT 1) AS last_message,
            (SELECT created_at FROM messages
             WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id)
             ORDER BY created_at DESC LIMIT 1) AS last_message_at
     FROM users u
     WHERE u.id != ?
       AND EXISTS (
         SELECT 1 FROM messages m
         WHERE (m.sender_id = u.id AND m.receiver_id = ?)
            OR (m.sender_id = ? AND m.receiver_id = u.id)
       )
     ORDER BY last_message_at DESC`,
    [userId, userId, userId, userId, userId, userId, userId],
    (error, rows) => {
      if (error) {
        return res.status(500).json({ message: "Erreur de chargement." });
      }
      return res.json(rows);
    }
  );
});

router.get("/conversations/:userId/messages", authMiddleware, (req, res) => {
  const me = req.user.id;
  const other = Number(req.params.userId);
  if (!other || other === me) {
    return res.status(400).json({ message: "Conversation invalide." });
  }

  db.all(
    `SELECT id, sender_id, receiver_id, content, created_at
     FROM messages
     WHERE (sender_id = ? AND receiver_id = ?)
        OR (sender_id = ? AND receiver_id = ?)
     ORDER BY created_at ASC`,
    [me, other, other, me],
    (error, rows) => {
      if (error) {
        return res.status(500).json({ message: "Erreur de chargement." });
      }
      return res.json(rows);
    }
  );
});

router.post("/conversations/:userId/messages", authMiddleware, (req, res) => {
  const me = req.user.id;
  const other = Number(req.params.userId);
  const content = String(req.body.content || "").trim();

  if (!other || other === me) {
    return res.status(400).json({ message: "Destinataire invalide." });
  }
  if (!content) {
    return res.status(400).json({ message: "Message vide." });
  }
  if (content.length > 2000) {
    return res.status(400).json({ message: "Message trop long." });
  }

  db.get("SELECT id FROM users WHERE id = ?", [other], (error, row) => {
    if (error) {
      return res.status(500).json({ message: "Erreur serveur." });
    }
    if (!row) {
      return res.status(404).json({ message: "Destinataire introuvable." });
    }

    db.run(
      "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
      [me, other, content],
      function onInsert(insertError) {
        if (insertError) {
          return res.status(500).json({ message: "Envoi impossible." });
        }
        const payload = {
          id: this.lastID,
          sender_id: me,
          receiver_id: other,
          content,
          created_at: new Date().toISOString(),
        };
        emitToUser(other, "chat:message", payload);
        emitToUser(me, "chat:message", payload);
        return res.status(201).json(payload);
      }
    );
  });
});

module.exports = { chatRoutes: router };

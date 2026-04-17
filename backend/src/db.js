const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "ecommerce.sqlite");
const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) reject(error);
      else resolve(this);
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });

const seedProducts = async () => {
  const bcrypt = require("bcryptjs");
  const existingUser = await get("SELECT id FROM users WHERE email = ?", [
    "demo@bazardshop.dev",
  ]);

  let userId = existingUser?.id;
  if (!userId) {
    const passwordHash = await bcrypt.hash("Demo1234!", 10);
    const inserted = await run(
      "INSERT INTO users (name, email, password_hash, bio) VALUES (?, ?, ?, ?)",
      [
        "Vendeur Demo",
        "demo@bazardshop.dev",
        passwordHash,
        "Compte de demonstration pour tester rapidement l'application.",
      ]
    );
    userId = inserted.lastID;
  }

  const countRow = await get("SELECT COUNT(*) AS total FROM products");
  if ((countRow?.total || 0) > 0) return;

  const demoProducts = [
    {
      title: "Casque Bluetooth UrbanSound",
      description: "Casque confortable avec reduction de bruit active.",
      price: 89.9,
      image:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Sac a dos Tech Nomad",
      description: "Sac robuste pour laptop 15 pouces, ideal cours et travail.",
      price: 59.0,
      image:
        "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Montre Connectee Pulse",
      description: "Suivi activite, notifications et autonomie longue duree.",
      price: 129.5,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  for (const product of demoProducts) {
    await run(
      "INSERT INTO products (title, description, price, image_url, created_by) VALUES (?, ?, ?, ?, ?)",
      [product.title, product.description, product.price, product.image, userId]
    );
  }
};

const initDb = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        bio TEXT DEFAULT '',
        avatar_url TEXT DEFAULT '',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        image_url TEXT DEFAULT '',
        created_by INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(created_by) REFERENCES users(id)
      )
    `);
  });

  seedProducts().catch(() => {});
};

module.exports = { db, initDb };

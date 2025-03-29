const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// API Endpoint to fetch user by ID
app.get("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  const query = "SELECT full_name, role FROM users WHERE id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(results[0]);
  });
});

// API Endpoint to fetch low stock items
app.get("/api/inventory/low-stock", (req, res) => {
  const query = `
    SELECT 
      id,
      name,
      category,
      quantity,
      unit,
      min_stock_level
    FROM inventory_items
    WHERE quantity <= min_stock_level
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching low stock items:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
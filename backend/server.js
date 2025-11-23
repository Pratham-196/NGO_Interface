// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const { initializeDatabase, getPool } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "NGO Backend running with MySQL" });
});

/* ============================
      USER REGISTRATION
=============================== */
app.post("/register", async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    if (!fullName || !email || !username || !password) {
      return res
        .status(400)
        .json({ message: "All fields (fullName, email, username, password) required" });
    }

    const db = getPool();

    // Check existing user
    const [existing] = await db.query(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      "INSERT INTO users (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, fullName]
    );

    res.json({
      message: "Registration successful",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
            LOGIN
=============================== */
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate inputs
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const db = getPool();
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = rows[0];

    // Compare password (password_hash column)
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
     VOLUNTEER SUBMISSIONS
=============================== */
app.post("/volunteers", async (req, res) => {
  try {
    const { name, email, phone, location, interests, experience, source } = req.body || {};

    if (!name || !email || !location) {
      return res.status(400).json({
        message: "Fields name, email, and location are required",
      });
    }

    const normalizedInterests = normalizeInterests(interests);
    const db = getPool();

    const [result] = await db.query(
      `INSERT INTO volunteers (name, email, phone, location, interests, experience, source)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        email.trim(),
        phone?.trim() || null,
        location.trim(),
        JSON.stringify(normalizedInterests),
        experience?.trim() || null,
        source || "greenpeace",
      ]
    );

    res.status(201).json({
      message: "Volunteer submission saved",
      volunteerId: result.insertId,
    });
  } catch (error) {
    console.error("Volunteer submission error:", error);
    res.status(500).json({ message: "Unable to save volunteer submission" });
  }
});

app.get("/volunteers", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const db = getPool();

    const [rows] = await db.query(
      `SELECT id, name, email, phone, location, interests, experience, source, created_at
       FROM volunteers
       ORDER BY created_at DESC
       LIMIT ?`,
      [limit]
    );

    const volunteers = rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      location: row.location,
      interests: safeParseJson(row.interests),
      experience: row.experience,
      source: row.source,
      createdAt: row.created_at ? row.created_at.toISOString() : null,
    }));

    res.json({ volunteers });
  } catch (error) {
    console.error("Fetch volunteers error:", error);
    res.status(500).json({ message: "Unable to fetch volunteers" });
  }
});

function normalizeInterests(interests) {
  if (!interests) return [];

  if (Array.isArray(interests)) {
    return interests
      .map((interest) => String(interest || "").trim())
      .filter(Boolean)
      .slice(0, 10);
  }

  if (typeof interests === "string") {
    return interests
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean)
      .slice(0, 10);
  }

  return [];
}

function safeParseJson(payload) {
  if (!payload) return [];
  try {
    const parsed = JSON.parse(payload);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* ============================
      START SERVER
=============================== */
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});

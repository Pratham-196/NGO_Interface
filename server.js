const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");
const { initializeDatabase } = require("./backend/db");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

// --- CONNECT ONLINE MYSQL ---
const db = mysql.createConnection({
  host: "sql5.freesqldatabase.com",
  user: "sql5808599",
  password: "AAtRHwaFbw",
  database: "sql5808599",
  port: 3306
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to online MySQL!");
});

// Default route: Login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});
initializeDatabase();

// REGISTER API
app.post("/api/register", (req, res) => {
  const { fullName, email, username, password } = req.body;

  const checkQuery = "SELECT id FROM users WHERE email = ? OR username = ?";
  db.query(checkQuery, [email, username], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0)
      return res.status(400).json({ message: "Email or Username already exists" });

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ message: "Error hashing password" });

      const insertQuery =
        "INSERT INTO users (full_name, email, username, password_hash) VALUES (?, ?, ?, ?)";

      db.query(insertQuery,
        [fullName, email, username, hash],
        (err) => {
          if (err) return res.status(500).json({ message: "Insert failed" });
          res.status(201).json({ message: "Registration successful!" });
        }
      );
    });
  });
});

// LOGIN API
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        if (result.length === 0) return res.status(400).json({ message: "User not found" });

        const user = result[0];

        bcrypt.compare(password, user.password_hash, (err, match) => {
            if (err) return res.status(500).json({ message: "Error comparing password" });
            if (!match) return res.status(400).json({ message: "Incorrect password" });

            res.json({
                message: "Login successful!",
                fullName: user.full_name,
                username: user.username
            });
        });
    });
});


// --- RUN SERVER ---
app.listen(3000, () => console.log("Server running on port 3000"));

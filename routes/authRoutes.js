const express = require("express");
const db = require("../db");

const route = express.Router();

// ✅ Middleware to parse JSON
route.use(express.json());

/**
 * ✅ Signup route
 * - Validates username/password
 * - Handles duplicate usernames
 * - Returns clear success message
 */
route.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const query = "INSERT INTO users2 (username, password) VALUES (?, ?)";
    db.query(query, [username, password], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Username already taken!" });
        }
        console.error("❌ Signup error:", err.message);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.status(201).json({
        message: "Signup successful ✅",
        user: { id: result.insertId, username },
      });
    });
  } catch (err) {
    console.error("❌ Unexpected signup error:", err.message);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

/**
 * ✅ Login route
 * - Validates username/password
 * - Returns detailed error if incorrect
 */
route.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const query = "SELECT * FROM users2 WHERE username = ?";
    db.query(query, [username], (err, result) => {
      if (err) {
        console.error("❌ Login query error:", err.message);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.length === 0) {
        return res.status(401).json({ error: "Incorrect username or password!!!" });
      }

      const user = result[0];
      // If storing plain text passwords (not recommended in production)
      if (user.password !== password) {
        return res.status(401).json({ error: "Incorrect username or password!!!" });
      }

      res.status(200).json({
        message: "Login successful ✅",
        user: { id: user.id, username: user.username },
      });
    });
  } catch (err) {
    console.error("❌ Unexpected login error:", err.message);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

/**
 * ✅ Test route to quickly check CORS/connectivity
 */
route.get("/auth-test", (req, res) => {
  res.json({ message: "Auth routes are working 🚀" });
});

module.exports = route;

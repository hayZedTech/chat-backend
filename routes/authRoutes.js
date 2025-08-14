import express from "express";
import sql from "../db.js"; // postgres connection

const route = express.Router();

// ✅ Signup
route.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${password})
      RETURNING id
    `;
    res.json({ id: result[0].id });
  } catch (err) {
    if (err.code === "23505") { // Postgres duplicate key error
      return res.status(401).json({ error: "Username already taken!" });
    }
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login
route.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await sql`
      SELECT * FROM users WHERE username = ${username} AND password = ${password}
    `;

    if (result.length === 0) {
      return res.status(401).json({ error: "Incorrect username or password!!!" });
    }

    const user = result[0];
    res.json({ user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default route;

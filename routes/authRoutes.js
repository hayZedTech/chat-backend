// import express from "express";
// import sql from "../db.js"; // ✅ Postgres connection

// const route = express.Router();

// // ✅ Middleware to parse JSON
// route.use(express.json());

// /**
//  * ✅ Signup route
//  * - Validates username/password
//  * - Handles duplicate usernames
//  * - Returns clear success message
//  */
// route.post("/signup", async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) 
//     return res.status(400).json({ error: "Username and password are required." });

//   try {
//     const result = await sql`
//       INSERT INTO users (username, password)
//       VALUES (${username}, ${password})
//       RETURNING id, username
//     `;
//     res.status(201).json({ 
//       message: "Signup successful ✅", 
//       user: result[0] 
//     });
//   } catch (err) {
//     if (err.code === "23505") {
//       return res.status(409).json({ error: "Username already taken!" });
//     }
//     console.error("❌ Signup error:", err.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// /**
//  * ✅ Login route
//  * - Validates username/password
//  * - Returns detailed error if incorrect
//  */
// route.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) 
//     return res.status(400).json({ error: "Username and password are required." });

//   try {
//     const result = await sql`
//       SELECT id, username 
//       FROM users 
//       WHERE username = ${username} AND password = ${password}
//     `;
//     if (result.length === 0) 
//       return res.status(401).json({ error: "Incorrect username or password!!!" });

//     res.status(200).json({ 
//       message: "Login successful ✅", 
//       user: result[0] 
//     });
//   } catch (err) {
//     console.error("❌ Login error:", err.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// /**
//  * ✅ Test route to quickly check CORS/connectivity
//  */
// route.get("/auth-test", (req, res) => {
//   res.json({ message: "Auth routes are working 🚀" });
// });

// export default route;

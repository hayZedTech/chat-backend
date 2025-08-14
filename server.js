import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import sql from "./db.js"; // ✅ db connection
import authRoutes from "./routes/authRoutes.js"; // <-- import your login/signup routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Health check route
app.get("/health", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Mount authentication routes
app.use("/", authRoutes); 
// Now POST /login and POST /signup will work

// ✅ GET all messages
app.get("/app", async (req, res) => {
  const query = `
    SELECT 
      t.id, 
      t.name, 
      t.message, 
      t.replyTo, 
      TO_CHAR(t.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
      r.message AS replyMessage,
      r.name AS replyUser
    FROM tasks t
    LEFT JOIN tasks r ON t.replyTo = r.id
    ORDER BY t.created_at ASC
  `;
  try {
    const result = await sql.unsafe(query);
    res.json(result);
    console.log(result);
  } catch (err) {
    console.error("❌ GET error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST message
app.post("/app", async (req, res) => {
  const { user, msg, replyTo } = req.body;
  try {
    const result = await sql`
      INSERT INTO tasks (name, message, replyTo, created_at)
      VALUES (${user}, ${msg}, ${replyTo || null}, NOW())
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (err) {
    console.error("❌ POST error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ EDIT message
app.put("/app/:id", async (req, res) => {
  const id = req.params.id;
  const { msg } = req.body;
  try {
    const result = await sql`
      UPDATE tasks 
      SET message = ${msg}
      WHERE id = ${id}
      RETURNING *
    `;
    res.status(200).json(result[0]);
  } catch (err) {
    console.error("❌ PUT error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE message
app.delete("/app/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await sql`DELETE FROM tasks WHERE id = ${id}`;
    res.json({ success: true });
  } catch (err) {
    console.error("❌ DELETE error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

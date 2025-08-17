import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import sql from "./db.js"; // ✅ PostgreSQL connection
import authRoutes from "./routes/authRoutes.js"; // ✅ login/signup routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ CORS setup for local + Render frontend
const allowedOrigins = [
  "http://localhost:5173",             // Vite dev server
  "https://your-frontend.onrender.com" // Replace with your deployed frontend
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin like Postman or curl
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `CORS policy: No access from origin ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.options("*", cors()); // ✅ Handle preflight requests

app.use(bodyParser.json());

// ✅ Health check
app.get("/health", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Auth routes (signup/login)
app.use("/", authRoutes);

// ✅ Get all messages
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
  } catch (err) {
    console.error("❌ GET error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Post message
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

// ✅ Edit message
app.put("/app/:id", async (req, res) => {
  const { id } = req.params;
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

// ✅ Delete message
app.delete("/app/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM tasks WHERE id = ${id}`;
    res.json({ success: true });
  } catch (err) {
    console.error("❌ DELETE error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Root
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
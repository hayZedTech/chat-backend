const db = require("./db");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const joi = require("joi");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Use auth routes
app.use(authRoutes);



// 🔷 Task Routes
app.get("/app", (req, res) => {
  db.query("SELECT * FROM tasks", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(result);
    // console.log(result) 
  });
});

app.post("/app", (req, res) => {

  const {msg } = req.body;
  const query = "INSERT INTO tasks (message) VALUE (?, ?)";
  db.query(query, [msg], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ id: result.insertId, msg });
  });
});

app.put("/app:id", (req, res) => {
  // const { error } = appSchema.validate(req.body);
  // if (error) return res.status(400).json({ error: error.details[0].message });

  const id = req.params.id;
  const {msg } = req.body;
  const query = "UPDATE tasks SET message = ? WHERE id = ?";
  db.query(query, [msg, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ msg });
  });
});

app.delete("/app:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM tasks WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json();
  });
});

app.listen(PORT, () => {
  console.log("Listening on port:", PORT);
});

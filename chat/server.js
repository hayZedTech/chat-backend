const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const route = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(route);

// ✅ GET all messages with reply details and formatted date
app.get("/app", (req, res) => {
    const query = `
        SELECT 
            t.id, 
            t.name, 
            t.message, 
            t.replyTo, 
            DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
            r.message AS replyMessage,
            r.name AS replyUser
        FROM tasks t
        LEFT JOIN tasks r ON t.replyTo = r.id
        ORDER BY t.created_at ASC
    `;
    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// ✅ POST a new message (with optional replyTo)
app.post("/app", (req, res) => {
    const { user, msg, replyTo } = req.body;
    const query = "INSERT INTO tasks (name, message, replyTo, created_at) VALUES (?, ?, ?, NOW())";
    db.query(query, [user, msg, replyTo || null], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            id: result.insertId,
            user,
            msg,
            replyTo: replyTo || null,
            created_at: new Date().toISOString().slice(0, 19).replace("T", " ")
        });
    });
});

// ✅ EDIT message
app.put("/app/:id", (req, res) => {
    const id = req.params.id;
    const { msg } = req.body;
   const query = "UPDATE tasks SET message = ? WHERE id = ?";
    db.query(query, [msg, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ msg });
    });
});

// ✅ DELETE message
app.delete("/app/:id", (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM tasks WHERE id = ?";
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json();
    });
});

app.listen(PORT, () => {
    console.log("Listening on port", PORT);
});

const express = require("express");
const db = require("../db");

const route = express.Router();

route.post("/signup", (req, res)=>{
    const {username, password} = req.body;
    const query = "INSERT INTO users (username, password) VALUE(?, ?)";
    db.query(query, [username, password], (err, result)=>{
        if(err.code === "ER_DUP_ENTRY") return res.status(401).json({error:"Username already taken!"});
        if(err) return res.status(500).json({error:err.message});
        res.json({id:result.insertId});
    });
});

route.post("/login", (req, res)=>{
    const {username, password} = req.body;
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, result)=>{
         if(err) return res.status(500).json({error:err.message});
         if(result.length === 0) return res.status(401).json({error:"Incorrect username or password!!!"});

         const user = result[0];

         res.json({user: {id:user.id, username:user.username}});
    });
});

module.exports = route;
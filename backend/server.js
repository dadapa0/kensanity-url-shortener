const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, "db.json");

// initialize database if missing
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ urls: {}, visitors: 0 }, null, 2));
}

function loadDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// generate 4-character alphanumeric code
function generateCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let r = "";
  for (let i = 0; i < 4; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

// Shorten URL endpoint
app.post("/api/shorten", (req, res) => {
  const url = req.body.longUrl;
  if (!url) return res.status(400).json({ error: "Invalid URL" });

  const db = loadDB();
  const code = generateCode();
  db.urls[code] = url;
  saveDB(db);

  res.json({ code });
});

// Visitor counter endpoint
app.get("/api/visitors", (req, res) => {
  const db = loadDB();
  db.visitors++;
  saveDB(db);
  res.json({ visitors: db.visitors });
});

// Redirect shortened URL
app.get("/:code", (req, res) => {
  const code = req.params.code;
  const db = loadDB();
  if (db.urls[code]) return res.redirect(db.urls[code]);
  res.send("Invalid code");
});

// Listen on Render port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend running on port", PORT));

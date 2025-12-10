const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Render backend URL
const BASE = "https://kensanity-url-shortener.onrender.com";

const DB_FILE = path.join(__dirname, "db.json");

// Create DB if no exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ urls: {}, visitors: 0 }, null, 2));
}

function loadDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}
function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Create code
function generateCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let r = "";
  for (let i = 0; i < 4; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

// Shorten URL
app.post("/api/shorten", (req, res) => {
  const url = req.body.url;
  if (!url) return res.json({ error: "Invalid URL" });

  const db = loadDB();
  const code = generateCode();
  db.urls[code] = url;
  saveDB(db);

  return res.json({ shortUrl: `${BASE}/${code}` });
});

// Visitors
app.get("/api/visitors", (req, res) => {
  const db = loadDB();
  db.visitors++;
  saveDB(db);
  res.json({ count: db.visitors });
});

// Redirect Route
app.get("/:code", (req, res) => {
  const code = req.params.code;
  const db = loadDB();
  if (db.urls[code]) {
    return res.redirect(db.urls[code]);
  }
  res.send("Invalid code");
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend running on " + PORT));

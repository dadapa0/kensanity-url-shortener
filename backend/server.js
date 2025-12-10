import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const dbFile = "./db.json";

function readDB() {
  return JSON.parse(fs.readFileSync(dbFile));
}

function saveDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// API shorten
app.post("/api/shorten", (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) return res.json({ error: "Missing longUrl" });

  const shortId = nanoid(6);
  const shortUrl = `https://kensanity-url-shortener.onrender.com/${shortId}`;

  const db = readDB();
  db[shortId] = longUrl;
  saveDB(db);

  res.json({ shortUrl });
});

// redirect
app.get("/:id", (req, res) => {
  const id = req.params.id;
  const db = readDB();

  if (db[id]) {
    return res.redirect(db[id]);
  }
  res.status(404).send("URL not found.");
});

// root just so it doesn’t show “Cannot GET /”
app.get("/", (req, res) => {
  res.send("URL Shortener API working 👌");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

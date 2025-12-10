const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // npm install node-fetch@2

const app = express();
app.use(cors());
app.use(express.json());

const backendVisitors = { count: 0 }; // in-memory visitor counter

// Shorten URL via urlshort.dev
app.post("/api/shorten", async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.json({ error: "Missing longUrl" });

  try {
    const response = await fetch("https://api.encurtador.dev/encurtamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: longUrl })
    });

    const data = await response.json();

    if (data.urlEncurtada) {
      return res.json({ shortUrl: data.urlEncurtada });
    } else {
      return res.json({ error: "Failed to shorten URL" });
    }
  } catch (err) {
    console.error(err);
    return res.json({ error: "External API error" });
  }
});

// Visitor counter
app.get("/api/visitors", (req, res) => {
  backendVisitors.count++;
  res.json({ count: backendVisitors.count });
});

// Root route
app.get("/", (req, res) => {
  res.send("Kensanity URL Shortener API working 👌");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

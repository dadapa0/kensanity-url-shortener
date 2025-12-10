const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // npm install node-fetch@2

const app = express();
app.use(cors());
app.use(express.json());

const backendVisitors = { count: 0 };
const urlMap = {}; // Store mapping: code -> external short URL

// Validate custom code
app.post("/api/validate-code", (req, res) => {
  const { customCode } = req.body;
  if (!customCode || !/^[a-zA-Z0-9]{4}$/.test(customCode)) {
    return res.json({ valid: false, error: "Invalid format" });
  }
  if (urlMap[customCode]) {
    return res.json({ valid: false, error: "Code already used" });
  }
  res.json({ valid: true });
});

// Shorten URL via urlshort.dev
app.post("/api/shorten", async (req, res) => {
  const { longUrl, customCode } = req.body;
  if (!longUrl) return res.json({ error: "Missing longUrl" });

  if (customCode && urlMap[customCode]) {
    return res.json({ error: "Custom code already in use" });
  }

  try {
    const bodyData = { url: longUrl };
    if (customCode) bodyData.suffix = customCode;

    const response = await fetch("https://api.encurtador.dev/encurtamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData)
    });

    const data = await response.json();

    if (data.urlEncurtada) {
      const code = customCode || data.urlEncurtada.split("/").pop();
      urlMap[code] = data.urlEncurtada;
      return res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${code}` });
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

// Dynamic redirect route
app.get("/:code", (req, res) => {
  const code = req.params.code;
  const shortUrl = urlMap[code];

  if (!shortUrl) return res.status(404).send("Invalid short code");

  // Serve HTML loading page
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Redirecting...</title>
    <style>
      body { background:black; color:gold; font-family:Arial,sans-serif; text-align:center; padding-top:50px;}
      .loader { font-size:20px; animation: blink 1s infinite; }
      @keyframes blink { 0%, 50%, 100% {opacity:1;} 25%, 75% {opacity:0.2;} }
    </style>
  </head>
  <body>
    <div class="loader">Scanning long URL for safe browsing...</div>
    <script>
      setTimeout(() => { window.location.href = "${shortUrl}"; }, 2500);
    </script>
  </body>
  </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

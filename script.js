const BACKEND = "https://kensanity-url-shortener.onrender.com";

async function shorten() {
  const url = document.getElementById("urlInput").value.trim();
  if (!url) return alert("Enter a URL!");

  const res = await fetch(`${BACKEND}/shorten`, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ url })
  });

  const data = await res.json();
  document.getElementById("result").innerText = data.shortUrl;
}

// Load visitor counter
async function loadVisitors(){
  const r = await fetch(`${BACKEND}/visitors`);
  const j = await r.json();
  document.getElementById("visitorCount").innerText = j.count;
}
loadVisitors();

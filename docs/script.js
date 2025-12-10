const backend = "https://kensanity-url-shortener.onrender.com";

// Elements
const longInput = document.getElementById("longUrl");
const shortenBtn = document.getElementById("shortenBtn");
const resultBox = document.getElementById("resultBox");
const outputUrl = document.getElementById("outputUrl");
const copyBtn = document.getElementById("copyBtn");
const visitors = document.getElementById("visitors");

// Visitor counter
async function updateVisitors() {
  try {
    const res = await fetch(`${backend}/api/visitors`);
    const data = await res.json();
    visitors.innerText = "Visitors: " + data.count;
  } catch {
    visitors.innerText = "Visitors: --";
  }
}
updateVisitors();

// Shorten URL
shortenBtn.addEventListener("click", async () => {
  const longUrl = longInput.value.trim();
  if (!longUrl) return alert("Enter a URL");

  try {
    const res = await fetch(`${backend}/api/shorten`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ longUrl })
    });

    const data = await res.json();

    if (data.shortUrl) {
      outputUrl.value = data.shortUrl;
      resultBox.style.display = "block";
    } else if (data.error) {
      alert("Error: " + data.error);
    } else {
      alert("Unknown error");
    }
  } catch (err) {
    console.error(err);
    alert("Backend not reachable");
  }
});

// Copy button
copyBtn.addEventListener("click", () => {
  outputUrl.select();
  navigator.clipboard.writeText(outputUrl.value);
  alert("Copied!");
});

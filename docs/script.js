const backend = "https://kensanity-url-shortener.onrender.com";

// DOM
const longInput = document.getElementById("longUrl");
const resultBox = document.getElementById("resultBox");
const shortenBtn = document.getElementById("shortenBtn");
const copyBtn = document.getElementById("copyBtn");
const outputUrl = document.getElementById("outputUrl");
const visitors = document.getElementById("visitors");

// Visitor counter
async function updateVisitors() {
  try {
    const res = await fetch(`${backend}/api/visitors`);
    const json = await res.json();
    visitors.innerText = "Visitors: " + json.count;
  } catch {
    visitors.innerText = "Visitors: --";
  }
}
updateVisitors();

// Shorten URL btn
shortenBtn.addEventListener("click", async () => {
  const longUrl = longInput.value.trim();
  if (!longUrl) return alert("Enter a URL!");

  try {
    const res = await fetch(`${backend}/api/shorten`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ url: longUrl })
    });
    const json = await res.json();
    if (json.error) return alert("Server error");
    
    outputUrl.value = json.shortUrl;
    resultBox.style.display = "block";
  } catch {
    alert("Backend unreachable.");
  }
});

// Copy
copyBtn.addEventListener("click", () => {
  outputUrl.select();
  navigator.clipboard.writeText(outputUrl.value);
  alert("Copied!");
});

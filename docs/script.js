// Render backend URL
const backend = "https://kensanity-url-shortener.onrender.com";

// Shorten URL function (called by button)
async function shorten() {
    const longInput = document.getElementById("longUrl");
    const shortInput = document.getElementById("shortUrl");
    const realLink = document.getElementById("realLink");
    const shortResult = document.getElementById("short-result");

    const longUrl = longInput.value.trim();
    if (!longUrl) return alert("Enter a URL");

    try {
        const res = await fetch(`${backend}/api/shorten`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ longUrl })
        });

        const data = await res.json();

        if (data.shortUrl) {
            shortInput.value = data.shortUrl;
            realLink.innerHTML = `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
            shortResult.style.display = "block";
        } else if (data.error) {
            alert("Error: " + data.error);
        } else {
            alert("Unknown error");
        }
    } catch (err) {
        console.error(err);
        alert("Backend not reachable");
    }
}

// Copy short URL function (called by button)
function copyShort() {
    const shortInput = document.getElementById("shortUrl");
    shortInput.select();
    navigator.clipboard.writeText(shortInput.value);
    alert("Copied!");
}

// Visitor counter
async function updateVisitors() {
    const visitorCount = document.getElementById("visitorCount");
    try {
        const res = await fetch(`${backend}/api/visitors`);
        const data = await res.json();
        visitorCount.innerText = data.count;
    } catch (err) {
        console.error(err);
        visitorCount.innerText = "--";
    }
}

// Initialize visitor counter on page load
updateVisitors();

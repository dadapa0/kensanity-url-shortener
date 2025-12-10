const backend = "https://kensanity-url-shortener.onrender.com";

// Shorten function
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

// Copy button function
function copyShort() {
    const shortInput = document.getElementById("shortUrl");
    shortInput.select();
    navigator.clipboard.writeText(shortInput.value);
    alert("Copied!");
}

// Visitor counter
async function updateVisitors() {
    const visitorsElem = document.getElementById("visitors");
    if (!visitorsElem) return;

    try {
        const res = await fetch(`${backend}/api/visitors`);
        const data = await res.json();
        visitorsElem.innerText = "Visitors: " + data.count;
    } catch {
        visitorsElem.innerText = "Visitors: --";
    }
}

// Initialize visitor counter
updateVisitors();

const backend = "https://kensanity-url-shortener.onrender.com";

async function shorten() {
    const longInput = document.getElementById("longUrl");
    const customInput = document.getElementById("customCode");
    const shortInput = document.getElementById("shortUrl");
    const realLink = document.getElementById("realLink");
    const shortResult = document.getElementById("short-result");

    const longUrl = longInput.value.trim();
    const customCode = customInput.value.trim();

    if (!longUrl) return alert("Enter a URL");
    if (customCode && !/^[a-zA-Z0-9]{4}$/.test(customCode)) {
        return alert("Custom code must be exactly 4 alphanumeric characters");
    }

    // Validate custom code first
    if (customCode) {
        const check = await fetch(`${backend}/api/validate-code`, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({ customCode })
        });
        const result = await check.json();
        if (!result.valid) return alert(result.error || "Custom code not valid");
    }

    try {
        const res = await fetch(`${backend}/api/shorten`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ longUrl, customCode })
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

updateVisitors();

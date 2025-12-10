const apiBase = "https://kensanity-url-shortener.onrender.com";

document.getElementById("shortenBtn").addEventListener("click", async () => {
    const longUrl = document.getElementById("longUrl").value;
    if (!longUrl) return alert("Enter URL first!");

    try {
        const response = await fetch(`${apiBase}/api/shorten`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ longUrl })
        });

        const data = await response.json();

        if (data.shortUrl) {
            document.getElementById("result").innerHTML =
                `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
        } else {
            alert("Error shortening!");
        }
    } catch (err) {
        alert("Backend error or offline.");
        console.error(err);
    }
});

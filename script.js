// IMPORTANT: put your actual Render backend URL here:
const BACKEND_URL = "https://kensanity-url-shortener.onrender.com";

// shorten
async function shorten(){
    const longUrl = document.getElementById("longUrl").value.trim();
    if(!longUrl){ alert("Enter URL"); return; }

    try{
        const response = await fetch(`${BACKEND_URL}/api/shorten`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({longUrl})
        });

        const data = await response.json();
        if(data.code){
            // show pretty URL
            document.getElementById("shortUrl").value = `ken.sanity/${data.code}`;

            // real working clickable link
            document.getElementById("realLink").innerHTML =
                `<a href="${BACKEND_URL}/${data.code}" target="_blank" style="color:gold;">Open link</a>`;

            document.getElementById("short-result").style.display="block";
        }
    } catch(err){
        console.error(err);
        alert("Server error");
    }
}

// copy button
function copyShort(){
    let shortUrl = document.getElementById("shortUrl");
    shortUrl.select();
    shortUrl.setSelectionRange(0,99999);
    navigator.clipboard.writeText(shortUrl.value);
    alert("Copied!");
}

// visitor counter
async function loadVisitorCounter(){
    try{
        const res = await fetch(`${BACKEND_URL}/api/visitors`);
        const data = await res.json();
        document.getElementById("visitorCount").textContent = data.visitors || 0;
    }catch(e){
        document.getElementById("visitorCount").textContent = "?";
    }
}
loadVisitorCounter();


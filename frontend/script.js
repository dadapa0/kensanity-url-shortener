const backend = "<BACKEND_URL>"; // e.g. https://kensanity-backend.onrender.com

async function shorten(){
  const url = document.getElementById("longUrl").value.trim();
  const custom = document.getElementById("customCode").value.trim();

  const res = await fetch(`${backend}/api/shorten`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ url, code: custom })
  });
  const j = await res.json();
  if(!res.ok){
    document.getElementById("result").innerHTML = "Error: "+j.error;
    return;
  }
  document.getElementById("result").innerHTML =
    `<strong>Short URL:</strong> ken.sanity/${j.code}`;
  refreshList();
}

async function refreshList(){
  const r = await fetch(`${backend}/api/list`);
  const list = await r.json();
  const box = document.getElementById("linkList");
  box.innerHTML="";
  list.forEach(item=>{
    box.innerHTML += `<div>ken.sanity/${item.code} ➜ ${item.url}</div>`;
  });
}

async function countVisitor(){
  const r = await fetch(`${backend}/api/visit`);
  const j = await r.json();
  document.getElementById("visitorCounter").innerText =
    `Visitors: ${j.total}`;
}

// events
document.getElementById("shortenBtn").onclick = shorten;
document.getElementById("refreshBtn").onclick = refreshList;

window.onload = ()=>{
  refreshList();
  countVisitor();
};

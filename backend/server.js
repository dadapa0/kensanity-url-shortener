const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
app.use(cors());

const app = express();
const db = new sqlite3.Database("./kensanity.sqlite3");

app.use(cors());
app.use(express.json());

// Init tables
db.serialize(()=>{
  db.run(`CREATE TABLE IF NOT EXISTS links(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE,
    url TEXT NOT NULL,
    created_at INTEGER,
    hits INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS visitors(
    id INTEGER PRIMARY KEY AUTOINCREMENT
  )`);
});

// 4-char lowercase alphanumeric
function generateCode(){
  const chars="abcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(4)].map(()=>chars[Math.floor(Math.random()*chars.length)]).join("");
}

// shorten
app.post("/api/shorten",(req,res)=>{
  let {url,code} = req.body;
  url = url?.trim();
  code = code?.trim();

  if(!url) return res.status(400).json({error:"url required"});
  if(code && !/^[a-z0-9]{4}$/.test(code))
    return res.status(400).json({error:"custom code must be 4 lowercase alphanumeric"});

  const tryInsert = (c)=>{
    db.run(
      `INSERT INTO links(code,url,created_at) VALUES(?,?,?)`,
      [c,url,Date.now()],
      function(err){
        if(err){
          if(code) return res.status(409).json({error:"code exists"});
          return tryInsert(generateCode());
        }
        res.json({code:c, url});
      }
    );
  };

  tryInsert(code?code:generateCode());
});

// redirect
app.get("/:code",(req,res)=>{
  const code=req.params.code;
  db.get(`SELECT url FROM links WHERE code=?`,[code],(err,row)=>{
    if(!row) return res.status(404).send("Not found");
    db.run(`UPDATE links SET hits=hits+1 WHERE code=?`,[code]);
    const final = row.url.match(/^https?:\/\//)? row.url : "https://"+row.url;
    res.redirect(final);
  });
});

// list
app.get("/api/list",(req,res)=>{
  db.all(`SELECT code,url,hits FROM links ORDER BY id DESC`,[],(err,rows)=>{
    res.json(rows);
  });
});

// visitor counter
app.get("/api/visit",(req,res)=>{
  db.run(`INSERT INTO visitors DEFAULT VALUES`);
  db.get(`SELECT COUNT(*) AS total FROM visitors`,[],(err,row)=>{
    res.json({total:row.total});
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));


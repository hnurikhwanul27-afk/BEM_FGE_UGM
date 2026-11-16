import "dotenv/config";
import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "schema"
});
const app = express();
app.use(express.json({ limit: "2mb" }));

const UP = path.join(here, "uploads");
fs.mkdirSync(UP, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: UP,
    filename: (_q, f, cb) => cb(null, crypto.randomUUID() + path.extname(f.originalname).toLowerCase()),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_q, f, cb) => cb(null, /^image\/(png|jpe?g|webp|gif)$/.test(f.mimetype)),
});

const auth = (req, res, next) => {
  try { jwt.verify((req.headers.authorization || "").slice(7), process.env.JWT_SECRET); next(); }
  catch { res.sendStatus(401); }
};

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body || {};
  const [rows] = await pool.query("select * from admin_users where username=?", [username]);
  const u = rows[0];
  if (!u || !(await bcrypt.compare(password || "", u.password_hash))) return res.sendStatus(401);
  res.json({ token: jwt.sign({ id: u.id }, process.env.JWT_SECRET, { expiresIn: "12h" }) });
});

app.get("/api/content", async (_q, res) => {
  const [rows] = await pool.query("select data from site_content where id=1");
  const d = rows[0]?.data;
  res.json(typeof d === "string" ? JSON.parse(d) : d || {});
});

app.put("/api/content", auth, async (req, res) => {
  await pool.query(
    `insert into site_content(id,data) values(1,?)
     on duplicate key update data=values(data), updated_at=now()`,
    [JSON.stringify(req.body)]
  );
  res.json({ ok: true });
});

app.post("/api/upload", auth, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "File tidak valid (hanya png/jpg/webp/gif)" });
  await pool.query("insert into media(filename,original_name,mime,size) values(?,?,?,?)",
    [req.file.filename, req.file.originalname, req.file.mimetype, req.file.size]);
  res.json({ url: "/uploads/" + req.file.filename });
});

app.use("/uploads", express.static(UP));

const dist = path.join(here, "../client/dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_q, res) => res.sendFile(path.join(dist, "index.html")));
}

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server BEM FGE UGM berjalan di http://localhost:${PORT}`);
});
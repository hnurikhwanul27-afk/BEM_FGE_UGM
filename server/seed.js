import "dotenv/config";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import fs from "fs";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "schema"
});
const content = JSON.parse(fs.readFileSync(new URL("./defaultContent.json", import.meta.url), "utf8"));

await pool.query(
  "insert ignore into site_content(id,data) values(1,?)",
  [JSON.stringify(content)]
);
const hash = await bcrypt.hash(process.env.ADMIN_PASS, 10);
await pool.query(
  `insert into admin_users(username,password_hash) values(?,?)
   on duplicate key update password_hash=values(password_hash)`,
  [process.env.ADMIN_USER, hash]
);
console.log("Seed selesai. Admin:", process.env.ADMIN_USER);
await pool.end();

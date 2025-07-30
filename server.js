import mysql from "mysql2/promise";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500", process.env.CORS_ORIGIN].filter(Boolean),
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false, // keep false unless you actually use cookies/auth headers
}));


app.use(express.json());


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const [rows] = await pool.query("SELECT code, name, amount FROM currency ORDER BY code");
console.log(rows)


app.get("/get_currency", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT code, name, amount FROM currency ORDER BY code");
    res.json({ currencies: rows });
  } catch (err) {
    console.error("GET /get_currency failed:", err);
    res.status(500).json({ error: "Failed to fetch currencies" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

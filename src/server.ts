import express, { type Request, type Response } from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

// TRIK PAMUNGKAS: Pindahkan ke variabel ber-tipe 'any' dulu
const expressApp: any = express;
const app = expressApp(); // <-- Garis merah dijamin 100% hilang di sini

// Izinkan React (Frontend) mengakses API ini
app.use(cors());
app.use(express.json());

// Konfigurasi koneksi ke DBeaver / PostgreSQL Anda
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "q1w2e3r4t5y6Al",
  port: 5432,
});

// Endpoint untuk mengetes
app.get("/api/test", async (_req: Request, res: Response) => {
  try {
    res.json({ message: "Halo dari Express! Server siap digunakan." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Endpoint untuk mengambil data
app.get("/api/users", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM "users"');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Endpoint untuk mengambil data Blogs
app.get("/api/blogs", async (_req: Request, res: Response) => {
  try {
    // PENTING: Sesuaikan "blogs" dengan nama tabel persis di DBeaver Anda!
    // Jika di DBeaver namanya huruf kecil semua (blogs), tulis: SELECT * FROM blogs
    const result = await pool.query('SELECT * FROM "blogs"');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Endpoint untuk mengambil data Product
app.get("/api/products", async (_req: Request, res: Response) => {
  try {
    // Sesuaikan "product" dengan nama tabel persis di DBeaver Anda!
    const result = await pool.query('SELECT * FROM "product"');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Jalankan Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server Backend berjalan di http://localhost:${PORT}`);
});

require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Registro de usuario
app.post("/api/registro", async (req, res) => {
  const { nombre_usuario, genero, intereses, carrera, ciclo } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO usuarios (nombre_usuario, genero, intereses, carrera, ciclo) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [nombre_usuario, genero, intereses, carrera, ciclo],
    );
    res.json({ success: true, userId: result.rows[0].id });
  } catch (err) {
    console.error("Error registro:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Lectura de perfil
app.get("/api/perfil/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length) {
      res.json({ success: true, perfil: result.rows[0] });
    } else {
      res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(` Backend corriendo en http://localhost:${PORT}`);
});

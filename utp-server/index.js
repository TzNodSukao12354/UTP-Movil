const express = require("express");
const pool = require("./db");
const app = express();
const port = 3000;

app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows); // Esto enviará a Juan y Marina a la App
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en el servidor");
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

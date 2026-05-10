const { Pool } = require("pg");

// Configuración de conexión
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "utp_movil_db",
  password: "utpmovil",
  port: 5432,
});

// Prueba rápida de conexión
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Error conectando a la base de datos:", err.stack);
  } else {
    console.log("✅ Conexión exitosa a PostgreSQL: Base de Datos lista.");
  }
});

module.exports = pool;

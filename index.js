const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Middleware CORS para aceptar múltiples puertos
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Ruta para obtener usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener datos:', err.message);
    res.status(500).json({ error: '❌ Error al obtener datos' });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});

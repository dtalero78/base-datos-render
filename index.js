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

// Ruta raíz para verificar el funcionamiento del backend
app.get('/', (req, res) => {
  res.send('✅ El backend está funcionando correctamente. Accede a /usuarios para obtener los datos.');
});

app.post('/insert', async (req, res) => {
  try {
      const { idGeneral, primerNombre, encuestaSalud, antecedentesFamiliares, edad, profesionUOficio, genero, celular } = req.body;

      const query = `
          INSERT INTO usuarios (idGeneral, primerNombre, encuestaSalud, antecedentesFamiliares, edad, profesionUOficio, genero, celular)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *;
      `;
      const values = [idGeneral, primerNombre, encuestaSalud, antecedentesFamiliares, edad, profesionUOficio, genero, celular];

      const result = await pool.query(query, values);
      res.status(200).json({ message: '✅ Datos guardados correctamente', data: result.rows[0] });
  } catch (err) {
      console.error('❌ Error al insertar datos:', err.message);
      res.status(500).json({ error: '❌ Error al insertar datos' });
  }
});


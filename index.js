const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// ✅ Middleware CORS configurado correctamente
app.use(cors({
  origin: '*', // Permitir cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Asegúrate de incluir 'OPTIONS'
  allowedHeaders: ['Content-Type', 'Authorization'] // Permitir estos encabezados
}));

app.options('*', cors()); // ✅ Responder correctamente a preflight OPTIONS

app.use(express.json());

// ✅ Rutas Backend
app.get('/', (req, res) => {
  res.send('✅ El backend está funcionando correctamente. Accede a /usuarios para obtener los datos.');
});

// ✅ Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener datos:', err.message);
    res.status(500).json({ error: '❌ Error al obtener datos' });
  }
});

// ✅ Insertar un nuevo registro
app.post('/insert', async (req, res) => {
  try {
    const {
      idGeneral,
      primerNombre,
      encuestaSalud,
      antecedentesFamiliares,
      edad,
      profesionUOficio,
      genero,
      celular
    } = req.body;

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

// ✅ Actualizar un registro existente
app.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { primerNombre, celular } = req.body;

    const query = `
      UPDATE usuarios
      SET primerNombre = $1, celular = $2
      WHERE id = $3
      RETURNING *;
    `;
    const values = [primerNombre, celular, id];

    const result = await pool.query(query, values);
    res.status(200).json({ message: '✅ Registro actualizado correctamente', data: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al actualizar el registro:', err.message);
    res.status(500).json({ error: '❌ Error al actualizar el registro' });
  }
});

// ✅ Eliminar un registro
app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: '❌ Registro no encontrado' });
    }

    res.status(200).json({ message: '✅ Registro eliminado correctamente', data: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al eliminar el registro:', err.message);
    res.status(500).json({ error: '❌ Error al eliminar el registro' });
  }
});

// ✅ Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});

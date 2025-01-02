// db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: {
    rejectUnauthorized: false // Permite conexiones SSL
  }
});

pool.connect()
  .then(() => console.log('✅ Conexión exitosa a la base de datos'))
  .catch(err => console.error('❌ Error en la conexión a la base de datos', err));

module.exports = pool;

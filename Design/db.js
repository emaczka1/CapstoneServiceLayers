const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.HEROKU_POSTGRESQL_BROWN_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

module.exports = pool;
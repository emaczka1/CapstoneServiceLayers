require('dotenv').config();
const express = require('express');
const path = require('path');
const pool = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;
const passport = require('./passport');
const authRoutes = require('./authRoutes');


pool.connect()
  .then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname)))
app.use(passport.initialize());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/', authRoutes);

// Get all characters from the database
app.get('/characters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM characters');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new character to the database
app.post('/characters', async (req, res) => {
  const { name, age, gender, species } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO characters (name, age, gender, species) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, age, gender, species]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });



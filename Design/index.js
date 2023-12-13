require('dotenv').config();
const express = require('express');
const path = require('path');
const pool = require('./db');
const passport = require('./passport');
const authRoutes = require('./authRoutes');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;


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

// Configure express-session middleware
app.use(
  session({
    secret: 'SunshineandRainbows', 
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);


// Get all characters from the database
app.get('/characters', async (req, res) => {
  try {
    // Retrieve user_id from the user object
    const user_id = req.user ? req.user.user_id : null;

    console.log('User ID from User Object:', user_id);

    // Ensure that user_id is a number
    if (isNaN(user_id)) {
      console.error('Invalid user_id:', user_id);
      return res.status(400).send('Invalid user_id');
    }

    const result = await pool.query('SELECT * FROM characters WHERE owner_id = $1', [user_id]);
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


// Create a new character 
app.post('/createCharacter', async (req, res) => {
  try {
    const {
      name = '',
      age = '',
      gender = '',
      species = '' ,
      eyes = '',
      hair = '',
      skin = '',
      height= '',
      other = '',
      personality = '',
      traits = '',
      background = '',
      occupation = '',
      hobbies = '',
      goals = '',
      fears = '',
      religion = '',
      flaws = '',
    } = req.body;

    console.log('Received character creation request:', req.body);
    const owner_id = req.user ? req.user.user_id : null;


    const result = await pool.query(
      'INSERT INTO characters (name, age, gender, species, eyes, hair, skin, height, other, personality, traits, background, occupation, hobbies, goals, fears, religion, flaws, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *',
      [name, age, gender, species, eyes, hair, skin, height, other, personality, traits, background, occupation, hobbies, goals, fears, religion, flaws, owner_id]
    );

    console.log('Character created successfully:', result.rows[0]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating character:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
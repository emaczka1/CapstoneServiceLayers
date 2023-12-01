const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('./passport');
const pool = require('./db');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
  
    try {
      // Ensure password is provided
      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }

      console.log('Original Password:', password); 

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed Password:', hashedPassword); 
  
      // Insert the new user into the database
      const newUser = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hashedPassword],
        (err, result) => {
            if (err) {
                console.error('Error inserting user into database: ', err);
                es.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json(result.rows[0]);
            }
            }
      );
  
      res.json(newUser.rows[0]);
    } catch (error) {
      console.error('Error registering user', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.post('/login', passport.authenticate('local'), (req, res) => {
    // If this function gets called, authentication was successful.
    res.json(req.user);
  });
  
  router.get('/logout', (req, res) => {
    req.logout();
    res.send('Logged out');
  });
  
  module.exports = router;
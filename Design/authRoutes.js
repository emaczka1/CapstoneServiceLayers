const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('./passport');
const pool = require('./db');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username = '', email ='',  password  =''} = req.body;
  
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
      try {
        const result = await pool.query(
          'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
          [username, email, hashedPassword]
        );
      
        console.log('Column Data Types:', result.fields.map(field => `${field.name}: ${field.dataTypeID}`));
        console.log('New User Added', result.rows[0]);

        return res.json(result.rows[0]);
      } catch (err) {
        console.error('Error inserting user into database: ', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      
    } catch (error) {
      console.error('Error registering user', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
  
      console.log('Login Attempt', { username: req.body.username, password: req.body.password})

      if (!user) {
        // Authentication failed
        return res.status(401).json({ message: 'Incorrect username or password.' });
      }
  
      try {
        // Store user_id in the session
        req.session.user_id = user.user_id;
  
        req.login(user, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }
  
          // Authentication successful
          console.log('Login Successful:', user);
  
          // Respond with user object directly
          return res.json({ message: 'Login successful', user });
        });
      } catch (error) {
        console.error('Error storing user_id in session:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    })(req, res, next);
  });
  
  router.get('/logout', (req, res) => {
    req.logout();
    res.send('Logged out');
  });
  
  module.exports = router;
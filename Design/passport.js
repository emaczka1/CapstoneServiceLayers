const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('./db');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log('Login Attempt', { username, password });
    try {
      const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

      if (user.rows.length === 0) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user.rows[0]);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  console.log('Serialized user ID:', user.username);
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  console.log('Deserialized username:', username);
  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    console.log('Deserialized user:', user.rows[0]);
    done(null, user.rows[0]);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;

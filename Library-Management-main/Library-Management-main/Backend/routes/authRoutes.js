// routes/authRoutes.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Signup Route
router.post(
  '/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    console.log('Request body:', req.body);

    try {
      let user = await User.findOne({ email });
      if (user) {
        console.log('User already exists')
        return res.send({ msg: 'User already exists' });
      }

      user = new User({
        name,
        email,
        password,
      });

      await user.save();
      console.log('User saved:', user);

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token=jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
        console.log(token)
      });
      res.cookie(token)
    } catch (err) {
      console.error('Error saving user:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// Login Route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token=jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        console.log("Authroutes: ",token)
        res.json({ token });
      });
      res.cookie(token)
    } catch (err) {
      console.error('Error logging in:', err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

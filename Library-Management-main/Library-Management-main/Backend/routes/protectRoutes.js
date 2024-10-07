const express = require('express');
const authMiddleware = require('./authMiddleware');
const router = express.Router();

router.get('/protected', authMiddleware, (req, res) => {
  res.send('This is a protected route');
});

module.exports = router;

const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {
  res.json({
    message: 'Login successful',
    user: { id: 1, username: 'user' },
    token: 'mock_token_12345',
  });
});

router.post('/signup', (req, res) => {
  res.json({
    message: 'Signup successful',
    user: { id: 1, username: req.body.username || 'newuser' },
    token: 'mock_token_12345',
  });
});

module.exports = router;

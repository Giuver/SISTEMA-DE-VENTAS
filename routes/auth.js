const express = require('express');
const router = express.Router();
const { login, registro } = require('../controllers/authController');

router.post('/login', login);
router.post('/registro', registro);

module.exports = router; 
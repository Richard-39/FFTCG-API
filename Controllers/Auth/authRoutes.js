const express = require('express');
const router = express.Router();

const { login, addUser } = require('./authController');

router.post('/login', login);
router.post('/user', addUser)

module.exports = router;
const express = require('express');
const router = express.Router();

const { addOpus } = require('./OtherContoller.js');

router.post("/opus", addOpus);

module.exports = router;
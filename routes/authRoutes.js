const express = require('express');
const { checkLoginStatus } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/checkLoginStatus', checkLoginStatus);

module.exports = router;

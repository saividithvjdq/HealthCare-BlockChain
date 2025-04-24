const express = require('express');
const router = express.Router();
const { createUser, getUsers } = require('../controllers/userController');

// POST /api/users
router.post('/create', createUser);

// GET /api/users
router.get('/get', getUsers);

module.exports = router;

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Debug log to confirm this file is being loaded
console.log("✅ UserRoutes initialized");

// Optional: Log function types for debugging
console.log("signup:", typeof UserController.signup);
console.log("login:", typeof UserController.login);

// Routes
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);

module.exports = router;

const express = require('express');
const router = express.Router();

// Import des routes
const apiRoutes = require('./api');
const pageRoutes = require('./pages');

// ==================== ROUTE CONFIGURATION ====================

// Routes API
router.use('/api', apiRoutes);

// Routes des pages
router.use('/', pageRoutes);

module.exports = router;

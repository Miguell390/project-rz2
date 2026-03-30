const express = require('express');
const router = express.Router();
const { createEvent, getActiveEvent } = require('../controllers/eventController');
const { protect, coordinatorOnly } = require('../middleware/authMiddleware');

// Only a coordinator can create an event
router.post('/', protect, coordinatorOnly, createEvent); 

// Anyone (or any logged in Judge) can fetch the active event
router.get('/active', protect, getActiveEvent); 

module.exports = router;
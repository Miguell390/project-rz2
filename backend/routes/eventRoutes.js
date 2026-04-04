// const express = require('express');
// const router = express.Router();
// const { createEvent, getActiveEvent } = require('../controllers/eventController');
// const { protect, coordinatorOnly } = require('../middleware/authMiddleware');

// // Only a coordinator can create an event
// router.post('/', protect, coordinatorOnly, createEvent); 

// // Anyone (or any logged in Judge) can fetch the active event
// router.get('/active', protect, getActiveEvent); 

// module.exports = router;

// phase 2
const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent, deleteEvent, getActiveEvent } = require('../controllers/eventController');
const { protect, coordinatorOnly } = require('../middleware/authMiddleware');

router.use(protect);

// ANY LOGGED IN USER (Judges) can ask "What is the active event?"
router.get('/active', getActiveEvent); 

// ONLY COORDINATORS can manage the events
router.get('/', coordinatorOnly, getEvents);
router.post('/', coordinatorOnly, createEvent);
router.put('/:id', coordinatorOnly, updateEvent);
router.delete('/:id', coordinatorOnly, deleteEvent);



module.exports = router;
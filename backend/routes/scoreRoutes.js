const express = require('express');
const router = express.Router();
const { submitScore } = require('../controllers/scoreController');
const { protect } = require('../middleware/authMiddleware');

// Any logged in Judge can submit a score
router.post('/', protect, submitScore);

module.exports = router;
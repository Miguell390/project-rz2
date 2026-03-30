const Score = require('../models/Score');
const Event = require('../models/Event'); // We need this to validate the criteria

// @route   POST /api/scores
// @desc    JUDGES: Submit or Update Score
const submitScore = async (req, res) => {
  try {
    const { projectId, eventId, scores } = req.body;
    const judgeId = req.user._id; // Extracted from the JWT token

    // 1. Fetch the event to see what the criteria are SUPPOSED to be
    const event = await Event.findById(eventId);
    
    // 2. Check if the Judge's submitted categories match the Event's categories
    const submittedKeys = Object.keys(scores);
    const isValid = event.criteria.every(c => submittedKeys.includes(c));
    
    if (!isValid) {
      return res.status(400).json({ message: "Score criteria mismatch with Event." });
    }

    // 3. Save or Update the Score
    const savedScore = await Score.findOneAndUpdate(
      { judge: judgeId, project: projectId }, 
      { event: eventId, scores: scores },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "Score saved successfully", savedScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { submitScore };
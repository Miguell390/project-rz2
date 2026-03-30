const Event = require('../models/Event');
const Score = require('../models/Score');

// 1. COORDINATOR: Create/Set Criteria for an Event
const createEvent = async (req, res) => {
  try {
    const { name, criteria } = req.body;
    const event = await Event.create({ name, criteria, isActive: true });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. JUDGES/PUBLIC: Fetch Active Event Criteria
const getActiveEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ isActive: true });
    if (!event) return res.status(404).json({ message: "No active event found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. JUDGES: Submit or Update Score (Upsert + Validation)
const submitScore = async (req, res) => {
  try {
    const { projectId, eventId, scores } = req.body;
    const judgeId = req.user._id;

    // VALIDATION: Ensure submitted scores match the event's criteria exactly
    const event = await Event.findById(eventId);
    const submittedKeys = Object.keys(scores);
    const isValid = event.criteria.every(c => submittedKeys.includes(c));
    
    if (!isValid) {
      return res.status(400).json({ message: "Score criteria mismatch with Event." });
    }

    // UPSERT: Update if exists, Create if it doesn't
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

module.exports = { createEvent, getActiveEvent, submitScore };
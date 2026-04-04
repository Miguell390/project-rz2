// const Event = require('../models/Event');
// const Score = require('../models/Score');

// // 1. COORDINATOR: Create/Set Criteria for an Event
// const createEvent = async (req, res) => {
//   try {
//     const { name, criteria } = req.body;
//     const event = await Event.create({ name, criteria, isActive: true });
//     res.status(201).json(event);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // 2. JUDGES/PUBLIC: Fetch Active Event Criteria
// const getActiveEvent = async (req, res) => {
//   try {
//     const event = await Event.findOne({ isActive: true });
//     if (!event) return res.status(404).json({ message: "No active event found" });
//     res.status(200).json(event);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// // 3. JUDGES: Submit or Update Score (Upsert + Validation)
// const submitScore = async (req, res) => {
//   try {
//     const { projectId, eventId, scores } = req.body;
//     const judgeId = req.user._id;

//     // VALIDATION: Ensure submitted scores match the event's criteria exactly
//     const event = await Event.findById(eventId);
//     const submittedKeys = Object.keys(scores);
//     const isValid = event.criteria.every(c => submittedKeys.includes(c));
    
//     if (!isValid) {
//       return res.status(400).json({ message: "Score criteria mismatch with Event." });
//     }

//     // UPSERT: Update if exists, Create if it doesn't
//     const savedScore = await Score.findOneAndUpdate(
//       { judge: judgeId, project: projectId }, 
//       { event: eventId, scores: scores },
//       { new: true, upsert: true, setDefaultsOnInsert: true }
//     );

//     res.status(200).json({ message: "Score saved successfully", savedScore });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = { createEvent, getActiveEvent, submitScore };

const Event = require('../models/Event');

// @desc    Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create new event
exports.createEvent = async (req, res) => {
  try {
    const { name, criteria, startTime, endTime } = req.body;
    
    // Safety check: End time must be after Start time
    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({ message: "End time must be after Start time" });
    }

    const event = await Event.create({ name, criteria, startTime, endTime });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete event
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc    JUDGE VIEW: Get the Currently Active Event automatically!
exports.getActiveEvent = async (req, res) => {
  try {
    const now = new Date();
    
    // 🪄 THE MAGIC QUERY: Find an event where NOW is between start and end
    const activeEvent = await Event.findOne({
      startTime: { $lte: now }, // Start time is Less Than or Equal to Now
      endTime: { $gte: now }    // End time is Greater Than or Equal to Now
    });

    if (!activeEvent) {
      return res.status(404).json({ message: "No active event at this time." });
    }

    res.json(activeEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
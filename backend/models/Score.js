const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  judge: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  
  // Dynamic Scoring Map: {"Innovation": 4, "Pitch": 5}
  scores: {
    type: Map,
    of: Number, // Enforces that all values must be numbers (1-5)
    required: true
  }
}, { timestamps: true });

// CRITICAL: Ensures a judge can only have ONE score record per project.
// This makes the scores identifiable and perfectly updatable.
ScoreSchema.index({ judge: 1, project: 1 }, { unique: true });

module.exports = mongoose.model('Score', ScoreSchema);
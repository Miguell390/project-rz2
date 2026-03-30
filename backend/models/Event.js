const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Sprint 1 Poster Session"
  isActive: { type: Boolean, default: true },
  criteria:[{ type: String, required: true }] // e.g., ['Scope', 'Solution', 'Pitch']
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
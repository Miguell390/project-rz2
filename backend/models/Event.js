// const mongoose = require('mongoose');

// const EventSchema = new mongoose.Schema({
//   name: { type: String, required: true }, // e.g., "Sprint 1 Poster Session"
//   isActive: { type: Boolean, default: true },
//   criteria:[{ type: String, required: true }] // e.g., ['Scope', 'Solution', 'Pitch']
// }, { timestamps: true });

// module.exports = mongoose.model('Event', EventSchema);

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  criteria: [{ type: String, required: true }],
  startTime: { type: Date, required: true }, // NEW
  endTime: { type: Date, required: true }    // NEW
}, { 
  timestamps: true,
  toJSON: { virtuals: true }, // Required to send virtuals to React
  toObject: { virtuals: true }
});

// dynamic event status
// Mongoose calculates this automatically every time we fetch an Event
EventSchema.virtual('status').get(function() {
  const now = new Date();
  if (now < this.startTime) return 'Upcoming';
  if (now > this.endTime) return 'Ended';
  return 'Active';
});

module.exports = mongoose.model('Event', EventSchema);
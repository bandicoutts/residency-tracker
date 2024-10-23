const mongoose = require('mongoose');

const DateTimeSchema = new mongoose.Schema({
  local: Date,     // Local date and time (for display)
  utc: Date,       // UTC date and time (for calculations)
  timezone: String // Timezone identifier (e.g., 'Europe/London')
});

const HolidaySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  destination: String,
  startDateTime: DateTimeSchema,
  endDateTime: DateTimeSchema,
});

module.exports = mongoose.model('Holiday', HolidaySchema);

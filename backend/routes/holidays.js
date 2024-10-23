// backend/routes/holidays.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Holiday = require('../models/Holiday');
const { check, validationResult } = require('express-validator');
const moment = require('moment-timezone');

// @route   POST /api/holidays
// @desc    Create a new holiday
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('destination', 'Destination is required').notEmpty(),
      check('startDateTime', 'Start date and time are required').notEmpty(),
      check('endDateTime', 'End date and time are required').notEmpty(),
      check('timezone', 'Timezone is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { destination, startDateTime, endDateTime, timezone } = req.body;

    // Data validation
    if (!moment.tz.zone(timezone)) {
      return res.status(400).json({ msg: 'Invalid timezone' });
    }

    const startLocal = moment.tz(startDateTime, timezone);
    const endLocal = moment.tz(endDateTime, timezone);

    if (!startLocal.isValid() || !endLocal.isValid()) {
      return res.status(400).json({ msg: 'Invalid date and time' });
    }

    if (endLocal.isBefore(startLocal)) {
      return res.status(400).json({ msg: 'End date must be after start date' });
    }

    try {
      const holiday = new Holiday({
        user: req.user.id,
        destination,
        startDateTime: {
          local: startLocal.toDate(),
          utc: startLocal.utc().toDate(),
          timezone,
        },
        endDateTime: {
          local: endLocal.toDate(),
          utc: endLocal.utc().toDate(),
          timezone,
        },
      });

      await holiday.save();
      res.json(holiday);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET /api/holidays
// @desc    Get all holidays for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const holidays = await Holiday.find({ user: req.user.id }).sort({
      'startDateTime.utc': -1,
    });
    res.json(holidays);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/holidays/:id
// @desc    Delete a holiday
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let holiday = await Holiday.findById(req.params.id);
    if (!holiday) return res.status(404).json({ msg: 'Holiday not found' });

    // Check user
    if (holiday.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Holiday.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Holiday removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

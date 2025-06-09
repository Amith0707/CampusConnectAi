import express from 'express';
import Event from '../models/Events.js';

const router = express.Router();

// POST /api/events - Create a new event (No auth for now)
router.post('/', async (req, res) => {
  console.log(" Incoming event creation request...");

  try {
    const { clubName, title, description, interests, freeOrPaid, postedAt } = req.body;
    console.log(" Request body:", req.body);

    if (!clubName || !title || !description || !interests || !freeOrPaid) {
      console.log(" Missing fields in request");
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newEvent = new Event({
      clubName,
      title,
      description,
      interests,
      freeOrPaid,
      postedAt: postedAt || new Date(),
    });

    console.log(" Saving event to DB...");
    await newEvent.save();

    console.log(" Event saved:", newEvent);
    res.status(201).json({ message: "Event created successfully", event: newEvent });

  } catch (err) {
    console.error(" Error saving event:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;

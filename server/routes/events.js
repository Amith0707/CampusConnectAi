import express from 'express';
import Event from '../models/Events.js';

const router = express.Router();

// POST /api/events - Create a new event
router.post('/', async (req, res) => {
  console.log("Incoming event creation request...");

  try {
    const { clubName, title, description, interests, freeOrPaid, postedAt,entryFee,googleFormLink } = req.body;
    console.log("Request body:", req.body);

    if (!clubName || !title || !description || !interests || !freeOrPaid || !googleFormLink) {
      console.log("Missing fields in request");
      return res.status(400).json({ message: "Missing required fields." });
    }
    // adding validation that for paid entries entry Fee needed
    if (
      freeOrPaid === "paid" &&
      (!entryFee || isNaN(entryFee) || Number(entryFee) <= 0)
    ) {
      return res.status(400).json({ message: "Valid entry fee is required for paid events" });
    }

    // Validate that the googleFormLink is a valid Google Form URL
    const googleFormPattern = /^https:\/\/docs\.google\.com\/forms\/.+$/;
    if (!googleFormPattern.test(googleFormLink)) {
      return res.status(400).json({ message: "Invalid Google Form link provided." });
    }
    const newEvent = new Event({
      clubName,
      title,
      description,
      interests,
      freeOrPaid,
      postedAt: postedAt || new Date(),
      //skipped doing isRegistrationOpen:true coz will be done by user
      entryFee:freeOrPaid ==="paid" ?entryFee:0,
      googleFormLink
    });

    console.log("Saving event to DB...");
    await newEvent.save();

    console.log("Event saved:", newEvent);
    res.status(201).json({ message: "Event created successfully", event: newEvent });

  } catch (err) {
    console.error("Error saving event:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//  NEW ROUTE: GET /api/events/latest - Returns latest 4 events
router.get('/latest', async (req, res) => {
  try {
    const latestEvents = await Event.find().sort({ postedAt: -1 }).limit(4);
    res.status(200).json(latestEvents);
  } catch (err) {
    console.error("Error fetching latest events:", err.message);
    res.status(500).json({ message: "Failed to fetch latest events", error: err.message });
  }
});

// PATCH /api/events/:id/registration - Toggle isRegistrationOpen
router.patch('/:id/registration', async (req, res) => {
  try {
    const { isRegistrationOpen } = req.body;

    if (typeof isRegistrationOpen !== 'boolean') {
      return res.status(400).json({ message: "isRegistrationOpen must be boolean." });
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { isRegistrationOpen },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Registration status updated", event: updated });
  } catch (err) {
    console.error("Error updating registration status:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


export default router;

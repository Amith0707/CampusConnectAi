import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "../models/Events.js";

dotenv.config();

console.log("🌐 Connecting to MongoDB Atlas...");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    return seedTedxEvents();
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err);
    process.exit(1);
  });

const seedTedxEvents = async () => {
  try {
    await Event.deleteMany({ clubName: "TEDx" });

    const events = [
      {
        clubName: "TEDx",
        title: "Voices Unheard",
        description: "Inspiring TEDx talks by students",
        interests: ["Talks", "Youth", "Inspiration"],
        freeOrPaid: "free",
        postedAt: new Date("2025-05-10T14:00:00"),
      },
      {
        clubName: "TEDx",
        title: "Future Forward",
        description: "Exploring AI, Climate and Innovation",
        interests: ["Tech", "Science", "Talks"],
        freeOrPaid: "paid",
        postedAt: new Date("2025-05-18T16:00:00"),
      },
      {
        clubName: "TEDx",
        title: "Unfiltered Voices",
        description: "Raw stories from real people",
        interests: ["Cultural", "Talks", "Fun"],
        freeOrPaid: "free",
        postedAt: new Date("2025-05-25T10:30:00"),
      },
    ];

    await Event.insertMany(events);
    console.log("✅ TEDx Events Seeded Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

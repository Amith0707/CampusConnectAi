import Participant from "../models/participant.js";
import Event from "../models/Events.js";

export async function logParticipation(usn, eventTitle) {
  console.log("🔍 logParticipation triggered for:", usn, eventTitle);

  try {
    const participant = await Participant.findOne({ usn: usn.toUpperCase() });
    if (!participant) {
      console.warn("⚠️ No participant found for USN:", usn);
      return;
    }
    console.log("✅ Participant found:", participant.email);

    const event = await Event.findOne({ title: eventTitle });
    if (!event) {
      console.warn("⚠️ Event not found:", eventTitle);
      return;
    }
    console.log("✅ Event found:", event.title);

    const alreadyLogged = participant.participatedEvents.includes(event._id);
    console.log("🧾 Already logged?", alreadyLogged);

    if (!alreadyLogged) {
      participant.participatedEvents.push(event._id);
      await participant.save();
      console.log("🎉 Participation logged successfully");
    } else {
      console.log("ℹ️ Event already in participatedEvents");
    }
  } catch (err) {
    console.error("❌ Error in logParticipation:", err.message);
  }
}

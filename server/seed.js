// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import bcrypt from 'bcryptjs';

// import ClubMember from './models/clubMember.js';
// import Announcement from './models/Announcement.js';
// import Media from './models/Media.js';
// import Participant from './models/participant.js';

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/CampusConnectDB';

// async function seedData() {
//   try {
//     // Connect to DB first
//     await mongoose.connect(MONGO_URI);
//     console.log("MongoDB connected ✅");

//     // Clear existing data AFTER connection
//     await ClubMember.deleteMany({});
//     await Announcement.deleteMany({});
//     await Media.deleteMany({});
//     await Participant.deleteMany({});

//     // Raw club members data with plain passwords
//     const rawClubMembers = [
//       { name: 'Adarsh Babu', usn: '1NH21AI005', password: 'password123', clubName: 'tedx' },
//       { name: 'Aga Asghar Murthuza', usn: '1NH21AI008', password: 'password123', clubName: 'tedx' },
//       { name: 'Amith V', usn: '1NH23AI015', password: 'password123', clubName: 'tedx' },
//       { name: 'Kavyaa Balakarthikeyan', usn: '1NH22AI070', password: 'password123', clubName: 'tedx' },
//       { name: 'Manoj RV', usn: '1NH22AI087', password: 'password123', clubName: 'tedx' },
//       { name: 'Shenaaya Abraham', usn: '1NH23AI148', password: 'password123', clubName: 'tedx' },
//       { name: 'Suraj V', usn: '1NH22AI181', password: 'password123', clubName: 'tedx' },
//       { name: 'Ayushi Swain', usn: '1NH23CS034', password: 'password123', clubName: 'tedx' },
//       { name: 'Abhishek C', usn: '1NH23CS012', password: 'password123', clubName: 'tedx' },
//       { name: 'John Joseph R', usn: '1NH21CS114', password: 'password123', clubName: 'tedx' },
//       { name: 'Mrinmayee Choudhury', usn: '1NH23CS151', password: 'password123', clubName: 'tedx' },
//       { name: 'Shatakshi', usn: '1NH23CS239', password: 'password123', clubName: 'tedx' },
//       { name: 'Abhinash TV', usn: '1NH22CD004', password: 'password123', clubName: 'tedx' },
//       { name: 'Akash Kengua', usn: '1NH22CD009', password: 'password123', clubName: 'tedx' },
//       { name: 'Sankalpa Kashyap', usn: '1NH22CE048', password: 'password123', clubName: 'tedx' },
//       { name: 'Aadhya Sharma', usn: '1NH23EC002', password: 'password123', clubName: 'tedx' },
//       { name: 'R Priyanshu Pandey', usn: '1NH23EC122', password: 'password123', clubName: 'tedx' },
//       { name: 'Rishab Swaroop', usn: '1NH21EC129', password: 'password123', clubName: 'tedx' },
//       { name: 'Shatakashi Pattanaik', usn: '1NH22EE099', password: 'password123', clubName: 'tedx' },
//       { name: 'Darshan D Madiwalar', usn: '1NH22IS033', password: 'password123', clubName: 'tedx' },
//       { name: 'Nivedita Ghai', usn: '1NH22IS107', password: 'password123', clubName: 'tedx' },
//       // lit_club members
//       { name: 'Chiranth Yadav', usn: '1NH21CS061', password: 'password123', clubName: 'lit_club' },
//       { name: 'Anish B', usn: '1NH22EC015', password: 'password123', clubName: 'lit_club' },
//       { name: 'Jayaadhithya J', usn: '1NH21CS108', password: 'password123', clubName: 'lit_club' },
//       { name: 'Aditya PV', usn: '1NH22IS007', password: 'password123', clubName: 'lit_club' },
//       { name: 'Arya Singh', usn: '1NH22CD018', password: 'password123', clubName: 'lit_club' },
//       { name: 'Darshan PD', usn: '1NH22CD027', password: 'password123', clubName: 'lit_club' },
//       { name: 'Abhijna', usn: '1NH23EC004', password: 'password123', clubName: 'lit_club' },
//       { name: 'Anisha', usn: '1NH23CD018', password: 'password123', clubName: 'lit_club' },
//       { name: 'Ishita Ashit Sampat', usn: '1NH23IS063', password: 'password123', clubName: 'lit_club' },
//       { name: 'Pratyush Mangal', usn: '1NH23EC121', password: 'password123', clubName: 'lit_club' },
//       { name: 'Reyhan Singh', usn: '1NH23EC132', password: 'password123', clubName: 'lit_club' },
//     ];

//     // Hash passwords for club members
//     const hashedClubMembers = await Promise.all(
//       rawClubMembers.map(async (member) => ({
//         ...member,
//         password: await bcrypt.hash(member.password, 10),
//       }))
//     );

//     await ClubMember.insertMany(hashedClubMembers);

//     // Announcements (no password)
//     await Announcement.insertMany([
//       { clubName: 'tedx', content: "Don't miss our TEDx talk on April!" },
//       { clubName: 'lit_club', content: "Join the poetry slam event next week!" },
//     ]);

//     // Media files (no password)
//     await Media.insertMany([
//       { clubName: 'tedx', fileUrl: '/uploads/Side Quests_post.jpg', fileType: 'image' },
//       { clubName: 'tedx', fileUrl: '/uploads/tedx_reel1.mp4', fileType: 'video' },
//     ]);

//     // Raw participants data with plain passwords
//     const rawParticipants = [
//       {
//         name: 'Alice Johnson',
//         email: 'alice@example.com',
//         password: 'alice123',
//         department: 'CSE',
//         interests: ['tech', 'innovation'],
//       },
//       {
//         name: 'Bob Williams',
//         email: 'bob@example.com',
//         password: 'bob123',
//         department: 'ECE',
//         interests: ['writing', 'public speaking'],
//       },
//       {
//         name: 'Clara Davis',
//         email: 'clara@example.com',
//         password: 'clara123',
//         department: 'ISE',
//         interests: ['film', 'editing'],
//       },
//     ];

//     // Hash passwords for participants
//     const hashedParticipants = await Promise.all(
//       rawParticipants.map(async (participant) => ({
//         ...participant,
//         password: await bcrypt.hash(participant.password, 10),
//       }))
//     );

//     await Participant.insertMany(hashedParticipants);

//     console.log("✅ Seed data inserted successfully!");
//     process.exit(0);
//   } catch (err) {
//     console.error("❌ Error seeding data:", err);
//     process.exit(1);
//   }
// }

// seedData();

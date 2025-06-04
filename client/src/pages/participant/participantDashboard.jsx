// import React, { useState } from "react";
// import "./ParticipantDashboard.css";

// const ParticipantDashboard = ({ user, clubs, upcomingEvents, paidEvents, openEvents, announcements, followedClubs }) => {
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [interests, setInterests] = useState(user.interests || []);

//   const toggleProfile = () => setProfileOpen(!profileOpen);

//   const addInterest = (interest) => {
//     if (interest && !interests.includes(interest)) {
//       setInterests([...interests, interest]);
//     }
//   };

//   const removeInterest = (interest) => {
//     setInterests(interests.filter(i => i !== interest));
//   };

//   return (
//     <div className="participant-dashboard">
//       {/* Navbar */}
//       <nav className="navbar">
//         <div className="logo">CampusConnect</div>
//         <button className="profile-btn" onClick={toggleProfile}>
//           {user.name[0].toUpperCase()}
//         </button>
//       </nav>

//       {/* Profile Slide-out */}
//       <div className={`profile-slideout ${profileOpen ? "open" : ""}`}>
//         <h2>{user.name}</h2>
//         <p>USN: {user.usn}</p>
//         <div className="interests-section">
//           <h3>Your Interests</h3>
//           <ul>
//             {interests.map((int, idx) => (
//               <li key={idx}>
//                 {int} <button onClick={() => removeInterest(int)}>Remove</button>
//               </li>
//             ))}
//           </ul>
//           <AddInterestForm onAdd={addInterest} />
//         </div>
//         <div className="followed-clubs">
//           <h3>Clubs You Follow</h3>
//           <ul>
//             {user.followedClubs.map((club, idx) => (
//               <li key={idx}>{club}</li>
//             ))}
//           </ul>
//         </div>
//         <button className="logout-btn">Logout</button>
//       </div>

//       {/* Main Content Glassmorphic Container */}
//       <main className="glass-container">
//         <button className="welcome-btn">Welcome back, {user.name}!</button>

//         {/* Upcoming Events */}
//         <section className="events-section">
//           <h2>Upcoming Events</h2>
//           <EventCards events={upcomingEvents} />
//         </section>

//         {/* Paid Events */}
//         <section className="events-section">
//           <h2>Paid Events</h2>
//           <EventCards events={paidEvents} />
//         </section>

//         {/* Clubs Carousel */}
//         <section className="clubs-carousel">
//           <h2>Clubs</h2>
//           <ClubsCarousel clubs={clubs} />
//         </section>

//         {/* Open Events */}
//         <section className="open-events">
//           <h2>Open for Registration</h2>
//           <EventCards events={openEvents} showRegister />
//         </section>

//         {/* Announcements & Media */}
//         <section className="announcements-media">
//           <h2>Announcements & Media</h2>
//           <AnnouncementsFeed items={announcements} />
//         </section>

//         {/* Followed Clubs */}
//         <section className="followed-clubs-list">
//           <h2>Your Followed Clubs</h2>
//           <FollowedClubsList clubs={followedClubs} />
//         </section>
//       </main>

//       {/* Chatbot Mini Window - Placeholder */}
//       <div className="chatbot-mini">
//         <button className="chatbot-toggle">Chatbot</button>
//       </div>
//     </div>
//   );
// };

// // Small helper components would be defined similarly: AddInterestForm, EventCards, ClubsCarousel, AnnouncementsFeed, FollowedClubsList...

// export default ParticipantDashboard;
import React from 'react';

const ParticipantDashboard = () => {
  const name = localStorage.getItem('name');

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#111', 
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '2rem'
    }}>
      Welcome {name || 'Participant'} — Dashboard Coming Soon 🚀
    </div>
  );
};

export default ParticipantDashboard;


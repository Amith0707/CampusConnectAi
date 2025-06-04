// import React, { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import LoadingScreen from './LoadingScreen';

// const Loading = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const signupData = location.state?.signupData;

//   useEffect(() => {
//     console.log('Loading effect started');
//     if (!signupData) {
//       console.warn('No signupData found in location state, redirecting to signup page');
//       navigate('/participant-signup');
//       return;
//     }

//     const registerUser = async () => {
//       console.log('Starting user registration with data:', signupData);

//       try {
//         const res = await fetch('http://localhost:5000/api/auth/register', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(signupData),
//         });
//         console.log('Received response:', res);

//         const data = await res.json();
//         console.log('Response JSON:', data);

//         if (res.ok && data._id) {
//           console.log('User registered successfully with ID:', data._id);
//           localStorage.setItem('participantId', data._id);
//           navigate('/participant-dashboard');
//         } else {
//           console.error('Registration failed:', data.message || 'Unknown error');
//           alert(data.message || 'Signup failed');
//           navigate('/participant-signup');
//         }
//       } catch (error) {
//         console.error('Error during registration fetch:', error);
//         alert('Something went wrong. Please try again.');
//         navigate('/participant-signup');
//       }
//     };

//     registerUser();
//   }, [signupData, navigate]);

//   return <LoadingScreen />;
// };

// export default Loading;

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

const Loading = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const justRegistered = location.state?.justRegistered;
  const participantId = location.state?.participantId;

  useEffect(() => {
    console.log('Loading effect started');

    if (!justRegistered || !participantId) {
      console.warn('Missing registration info, redirecting to signup...');
      navigate('/participant-signup');
      return;
    }

    // Store participant ID in local storage if not already
    localStorage.setItem('participantId', participantId);

    const timer = setTimeout(() => {
      console.log('Redirecting to participant dashboard...');
      navigate('/participant-dashboard');
    }, 1500); // 1.5 sec delay for loading effect

    return () => clearTimeout(timer); // cleanup
  }, [justRegistered, participantId, navigate]);

  return <LoadingScreen />;
};

export default Loading;


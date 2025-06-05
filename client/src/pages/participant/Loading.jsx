import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

const Loading = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const justRegistered = location.state?.justRegistered;
  const participantId = location.state?.participantId;
  const loginData = location.state?.loginData;

  useEffect(() => {
    const delay = 2000; // 2 seconds for loading animation

    console.log('[Loading] useEffect triggered with location.state:', location.state);

    // Handle LOGIN flow
    if (loginData) {
      console.log('[Loading] Login flow detected with loginData:', loginData);

      const loginUser = async () => {
        try {
          console.log('[Loading] Sending login request...');
          const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
          });

          console.log('[Loading] Received response, status:', res.status);

          const data = await res.json();
          console.log('[Loading] Parsed JSON response:', data);

          if (res.ok && data.userId) {
            console.log('[Loading] Login successful. Storing user data to localStorage...');
            localStorage.setItem('participantToken', data.token);
            localStorage.setItem('participantId', data.userId);
            localStorage.setItem('participantName', data.name);
            localStorage.setItem('participantDept', data.department);
            localStorage.setItem('participantInterests', JSON.stringify(data.interests || []));

            console.log('[Loading] Redirecting to /participant-dashboard after delay...');
            setTimeout(() => {
              console.log('[Loading] Navigating now to /participant-dashboard');
              navigate('/participant-dashboard');
            }, delay);
          } else {
            console.warn('[Loading] Login failed with message:', data.message);
            alert(data.message || 'Login failed');
            navigate('/participant-login');
          }
        } catch (error) {
          console.error('[Loading] Login error caught:', error);
          alert('Something went wrong. Please try again.');
          navigate('/participant-login');
        }
      };

      loginUser();
      return; // Prevent further execution
    }

    // Handle SIGNUP flow
    if (justRegistered && participantId) {
      console.log('[Loading] Signup flow detected for participantId:', participantId);

      localStorage.setItem('participantId', participantId);
      console.log('[Loading] participantId stored in localStorage:', participantId);

      const timer = setTimeout(() => {
        console.log('[Loading] Redirecting to /participant-dashboard after signup delay...');
        navigate('/participant-dashboard');
      }, delay);

      return () => {
        console.log('[Loading] Cleanup: clearing signup timer');
        clearTimeout(timer);
      };
    }

    // Invalid access to /loading
    console.warn('[Loading] Invalid access to /loading detected. Redirecting to /participant-login...');
    navigate('/participant-login');
  }, [location.state, navigate]);

  return <LoadingScreen />;
};

export default Loading;



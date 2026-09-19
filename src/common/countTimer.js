/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ code,  setCode }) => {
  const initialSeconds = 300;
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if(code !== '')
      setSeconds(initialSeconds)
  }, [code]);

  useEffect(() => {
    // Exit early if the countdown is finished
    if (seconds <= 0)
      { 
        setCode('');
        return;
      }

    // Set up the interval to decrement seconds every second
    const timer = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);

    // Clean up the interval when the component unmounts or seconds change
    return () => clearInterval(timer);
  }, [seconds]); // Re-run effect if seconds change

  // Format the display
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <p>
      {seconds === 0 ? 'Loading. . .' : seconds <= 0 ? `Time's up!`: formatTime(seconds)+ ' minutes' }
    </p>
  );
};

export default CountdownTimer;
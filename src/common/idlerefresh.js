import React from 'react';
import { useIdleTimer } from 'react-idle-timer';
//npm install react-idle-timer

const Idlerr = () => {
    const onIdle = () => {      
        window.location.reload();
    };

    const { getRemainingTime } = useIdleTimer({
        onIdle,
        timeout: 1000 * 60 * 10, // 10 minutes in milliseconds
        promptTimeout: 0, // No warning prompt
        crossTab: true, // Optional: Sync state across browser tabs
    });

    return (
        <div>
            <h1>My React App</h1>
            <p>This page will refresh after 10 minutes of inactivity.</p>
            <p>
                Time remaining until refresh: {Math.ceil(getRemainingTime() / 1000)} seconds
            </p>
        </div>
    );
};

export default Idlerr;
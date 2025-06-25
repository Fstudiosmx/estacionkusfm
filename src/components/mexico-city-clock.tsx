
"use client";

import { useState, useEffect } from 'react';

export function MexicoCityClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const mexicoTime = new Date().toLocaleTimeString('es-MX', {
        timeZone: 'America/Mexico_City',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setTime(mexicoTime);
    }, 1000);

    // Set initial time to avoid blank state
    const initialMexicoTime = new Date().toLocaleTimeString('es-MX', {
        timeZone: 'America/Mexico_City',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    setTime(initialMexicoTime);


    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-primary text-primary-foreground font-mono text-4xl text-center p-4 rounded-lg">
      {time || <span className="animate-pulse">00:00:00</span>}
    </div>
  );
}

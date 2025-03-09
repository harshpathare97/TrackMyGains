'use client'; 

import { useEffect } from 'react';

export default function Offline() {
  useEffect(() => {
    // Check if service workers are supported by the browser
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
  }, []);

  return null; // This component does not render anything to the UI
}

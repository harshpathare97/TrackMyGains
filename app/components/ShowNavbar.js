"use client";
import { useEffect } from 'react';
import Navbar from './Navbar'
import Alert from './Alert'
import { usePathname } from 'next/navigation';

function ShowNavbar() {
  const pathname = usePathname(); // Get the current page's pathname

  // Define the routes where you don't want to show the Navbar
  const hideNavbarRoutes = ['/', '/login', '/register'];

  // Conditional rendering of Navbar based on pathname
  const showNavbar = !hideNavbarRoutes.includes(pathname); // Hide navbar on matching routes

  useEffect(() => {
    // Check if service workers are supported by the browser
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
  }, []);

  return (
    showNavbar && <> <Navbar />
      <Alert /> </>
  )
}

export default ShowNavbar

"use client";
import Navbar from "./Navbar";
import Alert from "./Alert";
import { usePathname } from "next/navigation";

function ShowNavbar() {
  const pathname = usePathname(); // Get the current page's pathname

  // Define the routes where you don't want to show the Navbar
  const hideNavbarRoutes = ["/", "/login", "/register"];

  // Conditional rendering of Navbar based on pathname
  const showNavbar = !hideNavbarRoutes.includes(pathname); // Hide navbar on matching routes

  return (
    showNavbar && (
      <>
        <Navbar />
        <Alert />
      </>
    )
  );
}

export default ShowNavbar;

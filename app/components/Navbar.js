"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [token, setToken] = useState(null);
  const route = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
  }, []); 

  const handleLogout = () => {
    localStorage.clear();
    setToken(null); 
    route.push("/login");
  };

  return (
    <header id="navbar" className="bg-slate-900 sticky top-0 z-50 shadow-lg">
      <nav className="container bg-slate-900 py-3 md:py-4 mx-auto flex justify-center md:justify-between items-center px-6 relative z-10">
        <Link href="/" className="text-2xl font-semibold text-white">
          TrackMyGains
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-white hover:text-gray-300 transition duration-200">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-gray-300 transition duration-200">
            About
          </Link>
        </div>

        {/* Desktop Buttons */}
        {!token ? (
          <div className="hidden md:flex space-x-6">
            <Link href="/login" className="bg-white text-black px-4 py-2 rounded-lg shadow-lg hover:bg-gray-400 transition duration-200">
              Login
            </Link>
            <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-500 transition duration-200">
              Signup
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex space-x-6">
            <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 ml-24 mx-1 rounded-lg shadow-lg hover:bg-blue-500 transition duration-200">
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      <div id="mobileMenu" className='md:hidden bg-slate-600 text-white px-4 py-3 transition-all duration-300 flex justify-between'>
        <div className='mt-1'>
          <Link href="/" className="text-xl mx-2 hover:text-gray-300 transition duration-200">
            Home
          </Link>
          <Link href="/about" className="text-xl mx-2 hover:text-gray-300 transition duration-200">
            About
          </Link>
        </div>
        <div>
          {!token ? (
            <div className='mt-1'>
              <Link href="/login" className="bg-white text-black px-4 py-2 mx-2 rounded-lg shadow-lg hover:bg-gray-400 transition duration-200">
                Login
              </Link>
              <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 mx-2 rounded-lg shadow-lg hover:bg-blue-500 transition duration-200">
                Signup
              </Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 mx-1 rounded-lg shadow-lg hover:bg-blue-500 transition duration-200">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

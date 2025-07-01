"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import InstallApp from './InstallApp';
import Profile from './Profile';

const Navbar = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
  }, []);

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
          <InstallApp/>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-6">
          {!token ? (
            <>
              <Link href="/login" className="bg-white text-black px-4 py-2 rounded-lg shadow-lg hover:bg-gray-400 transition duration-200">
                Login
              </Link>
              <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-500 transition duration-200">
                Signup
              </Link>
            </>
          ) : (
            <Profile/>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div id="mobileMenu" className='md:hidden bg-slate-700 text-white px-4 py-2 transition-all duration-300 flex justify-between'>
        <div>
          <Link href="/" className="mx-2 hover:text-gray-300 transition duration-200">
            Home
          </Link>
          <Link href="/about" className="mx-2 hover:text-gray-300 transition duration-200">
            About
          </Link>
          <InstallApp />
        </div>
        <div>
          {!token ? (
            <Link href="/signup" className="bg-blue-600 text-white px-2 py-1 pt-1 mx-1 rounded-lg shadow-lg hover:bg-blue-500 transition duration-200">
              Signup
            </Link>
          ) : (
            <Profile/>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function Header({ onLogout }) {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="flex justify-between items-center container mx-auto">
        {/* Logo or Title */}
        <div className="text-xl font-gills sans">
        <Link href="/" className="hover:text-blue-300 transition duration-300 font-gill sans">
            Movie Booking
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:text-blue-300 transition duration-300 text-lg font-gills sans font-bold">
              Home
            </Link>
          </li>
          {/* You can add more navigation links here */}
        </ul>

        {/* Logout Button */}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            if (onLogout) onLogout(); // Notify parent component
          }}
          className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-full transition duration-300 font-gills sans font-bold text-lg "
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

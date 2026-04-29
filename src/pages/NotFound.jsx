import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="container mx-auto px-4 min-h-[70vh] flex flex-col">
      <nav className="py-20 text-sm">
        <Link to="/" className="text-gray-500">Home</Link> / <span className="font-semibold">404 Error</span>
      </nav>
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <h1 className="text-[110px] md:text-[150px] font-medium leading-none" style={{ fontSize: '150px' }}>404 Not Found</h1>
        <p className="text-lg mt-6">Your visited page not found. You may go home page.</p>
        <Link to="/" className="mt-12 bg-[#DB4444] text-white px-12 py-4 rounded hover:bg-red-600 transition-all">
          Back to home page
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
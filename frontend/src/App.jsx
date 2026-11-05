import React from 'react';
import { Navbar } from './components/navigation/Navbar';
import { Hero } from './components/hero/Hero';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#000000] text-[#F5F5F2] selection:bg-[#FF2B25] selection:text-white flex flex-col">
      {/* Full-width Grid Architectural Navbar */}
      <Navbar />

      {/* Full-screen Edge-to-Edge UNTAPPED Hero Section */}
      <main className="flex-1 w-full flex flex-col">
        <Hero />
      </main>
    </div>
  );
}

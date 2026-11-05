import React from 'react';
import { Hero } from '../components/hero/Hero';
import { ScrollExpansionSection } from '../components/sections/ScrollExpansionSection';

export const Home = () => {
  return (
    <div className="w-full bg-[#000000]">
      <Hero />
      <ScrollExpansionSection />
    </div>
  );
};

export default Home;

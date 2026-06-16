"use client";

import React from 'react';

export default function AboutUsPage() {
  return (
    <div className="bg-[#fcf9f8] min-h-screen pt-24 pb-24 font-sans">
      <div className="max-w-[800px] mx-auto px-6 md:px-8">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#001410] mb-8 tracking-tight">About Rent Vastra</h1>
        
        <div className="space-y-6 text-[#414846] leading-relaxed">
          <p className="text-lg">
            Rent Vastra was born out of a simple idea: luxury ethnic wear shouldn't be locked away in a closet after just one wearing. We believe that exceptional design and master craftsmanship should be experienced, shared, and celebrated.
          </p>
          
          <h2 className="font-serif text-2xl text-[#001410] pt-6 pb-2">Our Mission</h2>
          <p>
            We are democratizing access to India's top designer labels. By partnering directly with acclaimed boutique owners and heritage designers, we ensure that every piece you rent is 100% authentic, perfectly maintained, and delivered to your doorstep in pristine condition.
          </p>
          
          <h2 className="font-serif text-2xl text-[#001410] pt-6 pb-2">Sustainability Meets Luxury</h2>
          <p>
            The fashion industry is one of the largest contributors to global waste. By choosing to rent rather than buy outfit-heavy pieces like Lehengas and Sherwanis, you are actively participating in a circular economy. Look stunning for your special occasion, and let the outfit live on to make someone else's day just as magical.
          </p>

          <div className="bg-white p-8 border border-[#c1c8c5]/40 mt-12 rounded-xl text-center">
            <h3 className="font-serif text-xl text-[#001410] mb-3">Join the movement.</h3>
            <p className="text-sm text-zinc-500">Experience the magic of authentic Indian couture without the commitment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Hero from "./Hero";
import TrustStrip from "./TrustStrip";
import Occasions from "./Occasions";
import Trending from "./Trending";

export default function HomeView() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <TrustStrip />
      <Occasions />
      <Trending />
    </div>
  );
}


import React from "react";
import Hero from "./Hero";
import TrustStrip from "./TrustStrip";
import Occasions from "./Occasions";
import Trending from "./Trending";
import HowItWorks from "./HowItWorks";
import WhyRentVastra from "./WhyRentVastra";
import Reviews from "./Reviews";
import Promise from "./Promise";
import Newsletter from "./Newsletter";
import SocialJourney from "./SocialJourney";
import StylistBanner from "./StylistBanner";

export default function HomeView() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <TrustStrip />
      <Occasions />
      <Trending />
      <HowItWorks />
      <WhyRentVastra />
      <Reviews />
      <Promise />
      <Newsletter />
      <SocialJourney />
      <StylistBanner />
    </div>
  );
}


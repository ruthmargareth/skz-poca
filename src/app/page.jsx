"use client";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";

const Hero = () => {
  const [playVideo, setPlayVideo] = useState(false);

  return (
    <>
      <Navbar />
      <div className="fixed top-0 left-0 w-full h-full z-0">
        {!playVideo ? (
          <div className="w-full h-full relative bg-black">
            {/* Thumbnail */}
            <img
              src="https://img.youtube.com/vi/ovHoY8UBIu8/maxresdefault.jpg"
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
            {/* Overlay play button */}
            <button
              onClick={() => setPlayVideo(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition"
            >
              <svg
                className="w-20 h-20 text-white hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 84 84"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="42" cy="42" r="42" fill="rgba(0,0,0,0.6)" />
                <polygon points="33,24 33,60 60,42" fill="white" />
              </svg>
            </button>
          </div>
        ) : (
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/ovHoY8UBIu8?autoplay=1"
            title="Straykids Walkin On Water"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        )}
      </div>
    </>
  );
};

export default Hero;
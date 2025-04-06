"use client"; // This marks the component as client-side

import { useState, useEffect } from "react";
import Link from "next/link"; // Ensure you import the Link component for navigation

export default function Hero({ title, subtitle, imageUrl }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoomed, setZoomed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hovered, setHovered] = useState(false); // State to track hover over the area

  // Handle mouse move event to track mouse position
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Ensure we are on the client-side to use window
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server-side
  }

  return (
    <div
      className="min-h-screen relative group"
      onMouseMove={handleMouseMove}
      style={{
        cursor: "none", // Hides the cursor when hovering over the section
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-80 group-hover:opacity-40 transition-all duration-1000 z-10"></div>

      {/* Hero Section with background image */}
      <section
        className="relative text-white py-24 px-4"
        style={{
          backgroundImage: `url(${imageUrl})`, // Set the image as background
          backgroundSize: "cover", // Ensures the image fills the section
          backgroundPosition: "center", // Centers the image
          height: "100vh", // Full height of the viewport
        }}
      >
        


        {/* Text and Button Container */}
        <div
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center z-20"
          onMouseEnter={() => setHovered(true)} // Set hover state true when the text area is hovered
          onMouseLeave={() => setHovered(false)} // Reset hover state when mouse leaves
          style={{ zIndex: 20 }}
        >
          {/* Title */}
          <h1 className="text-8xl font-bold mb-4 transition-all duration-500 hover:scale-105 hover:text-red-300 hover:text-shadow-lg">
            {title}
          </h1>
          <p className="text-xl mb-6">{subtitle}</p>

          {/* Call to Action Button */}
          <div
            className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            onMouseEnter={() => setHovered(true)} // Set hover state true when the button is hovered
            onMouseLeave={() => setHovered(false)} // Reset hover state when mouse leaves
          >
            <Link href="/signup">
              <button className="px-8 py-4 bg-red-500 text-white text-2xl font-semibold rounded-full hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500 transition-all duration-300">
                Sign Up Now
              </button>
            </Link>
          </div>
        </div>

        {/* Circular Reveal Area with Zoom Effect */}
        <div
          className="absolute"
          style={{
            left: `${mousePosition.x - 100}px`, // Center circle based on mouse position
            top: `${mousePosition.y - 100}px`,
            width: "200px", // Size of the reveal area
            height: "200px",
            borderRadius: "50%",
            pointerEvents: "none", // Prevent this div from blocking interactions
            transition: "background 0.2s ease, transform 0.3s ease", // Smooth transition for background and zoom
            border: "2px solid white", // Optional: add border to make the reveal area more visible
            backgroundImage: `url(${imageUrl})`, // Use the same image for the reveal area
            backgroundSize: zoomed ? "1300%" : "1200%", // Zoom in the image inside the circle
            backgroundPosition: `${((mousePosition.x - 1) / window.innerWidth) * 100}% ${((mousePosition.y - 10) / window.innerHeight) * 100}%`, // Center the zoom effect based on mouse position
            backgroundBlendMode: "multiply", // Ensures the grain blends with the background
            opacity: !hovered ? 1 : 0, // Hide the circle if hovered over the text or button area
          }}
          onMouseEnter={() => setZoomed(true)} // Activate zoom effect
          onMouseLeave={() => setZoomed(false)} // Deactivate zoom effect
        ></div>
      </section>
    </div>
  );
}

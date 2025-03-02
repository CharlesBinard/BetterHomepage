"use client";

import useTheme from "@/hooks/useTheme";
import React, { useEffect, useState } from "react";

interface BackgroundImageProps {
  debugMode?: boolean;
  blurAmount?: number;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({
  debugMode = false,
  blurAmount = 3, // Default blur amount in pixels
}) => {
  const { backgroundImage, darkMode } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (backgroundImage) {
      console.log("Loading background image:", backgroundImage);
      const img = new Image();
      img.src = backgroundImage;
      img.onload = () => {
        console.log("Background image loaded successfully");
        setIsLoaded(true);
        setError(null);
      };
      img.onerror = () => {
        const errorMsg = `Failed to load image: ${backgroundImage}`;
        console.error(errorMsg);
        setError(errorMsg);
        setIsLoaded(false);
      };
    }
  }, [backgroundImage]);

  // Debugging overlay
  if (debugMode) {
    return (
      <>
        {/* Actual background element */}
        {renderBackground()}

        {/* Debug overlay */}
        <div className="fixed top-20 left-5 z-50 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg text-sm max-w-xs">
          <h3 className="font-bold mb-2">Background Debug</h3>
          <p>Background URL: {backgroundImage || "None"}</p>
          <p>Loaded: {isLoaded ? "Yes" : "No"}</p>
          <p>Applied as: Fixed position background element</p>
          <p>Dark Mode: {darkMode ? "Yes" : "No"}</p>
          <p>Blur Amount: {blurAmount}px</p>
          {error && <p className="text-red-500">{error}</p>}
          {backgroundImage && (
            <img
              src={backgroundImage}
              alt="Background preview"
              className="mt-2 border rounded w-full h-20 object-cover"
            />
          )}
        </div>
      </>
    );
  }

  // Just render the background element
  return renderBackground();

  // Helper function to render the background
  function renderBackground() {
    if (!backgroundImage || !isLoaded) return null;

    // Create a layered background with blur and overlay for better readability
    return (
      <>
        {/* Blurred background image layer */}
        <div
          className="fixed inset-0 z-[-2] transition-opacity duration-700"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: `blur(${blurAmount}px)`,
            opacity: isLoaded ? 1 : 0,
            transform: "scale(1.1)", // Slight scale to prevent blur edge artifacts
          }}
        />

        {/* Semi-transparent overlay for better contrast with content */}
        <div
          className="fixed inset-0 z-[-1] transition-opacity duration-500"
          style={{
            backgroundColor: darkMode
              ? "rgba(10, 15, 25, 0.2)" // Dark mode overlay
              : "rgba(255, 255, 255, 0.15)", // Light mode overlay
            backdropFilter: "brightness(1.05)",
            opacity: isLoaded ? 1 : 0,
          }}
        />
      </>
    );
  }
};

export default BackgroundImage;

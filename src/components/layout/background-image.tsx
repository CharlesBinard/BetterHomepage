"use client";

import useTheme from "@/hooks/use-theme";
import React, { useEffect, useState } from "react";

const BackgroundImage: React.FC = () => {
  const { backgroundImage, darkMode, backgroundBlur, backgroundScale } =
    useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (backgroundImage) {
      console.log("Loading background image:", backgroundImage);
      const img = new Image();
      img.src = backgroundImage;
      img.onload = () => {
        console.log("Background image loaded successfully");
        setIsLoaded(true);
      };
      img.onerror = () => {
        const errorMsg = `Failed to load image: ${backgroundImage}`;
        console.error(errorMsg);
        setIsLoaded(false);
      };
    }
  }, [backgroundImage]);

  const renderBackground = () => {
    if (!backgroundImage || !isLoaded) return null;

    // Calculate scale transform (100% = 1, 50% = 0.5, 150% = 1.5)
    const scaleValue = backgroundScale / 100;

    // Create a layered background with blur and overlay for better readability
    return (
      <>
        {/* Blurred background image layer */}
        <div
          className="fixed inset-0 z-[-2] transition-all duration-700"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: `blur(${backgroundBlur}px)`,
            opacity: isLoaded ? 1 : 0,
            transform: `scale(${scaleValue})`,
          }}
        />

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
  };

  return renderBackground();
};

export default BackgroundImage;

"use client";

import useTheme from "@/hooks/useTheme";
import React from "react";

const BackgroundImage: React.FC = () => {
  const { backgroundImage } = useTheme();

  if (!backgroundImage) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[-1]"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.15,
      }}
    />
  );
};

export default BackgroundImage;

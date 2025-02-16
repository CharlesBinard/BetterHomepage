"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const ThemeSwitcher: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = JSON.parse(localStorage.getItem("darkMode") || "false");
     setDarkMode(storedDarkMode);
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);


  return (
    <div>
      <Button variant="outline" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Thème Clair" : "Thème Sombre"}
      </Button>
    </div>
  );
};

export default ThemeSwitcher;

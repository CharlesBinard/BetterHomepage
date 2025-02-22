"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import useTheme from "@/hooks/useTheme";

const ThemeSwitcher: React.FC = () => {
  const {darkMode, switchTheme} = useTheme();

  return (
      <Button variant="outline" onClick={() => switchTheme()}>
        {darkMode ? "Thème Clair" : "Thème Sombre"}
      </Button>
  );
};

export default ThemeSwitcher;

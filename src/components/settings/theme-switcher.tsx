"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTheme, { BACKGROUND_IMAGES } from "@/hooks/use-theme";
import { ImageIcon, MoonIcon, SunIcon } from "lucide-react";
import React from "react";

const ThemeSwitcher: React.FC = () => {
  const { darkMode, backgroundImage, switchTheme, setBackgroundImage } =
    useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm"
        >
          {darkMode ? (
            <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <SunIcon className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Apparence</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Theme Toggle */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => switchTheme()}>
            {darkMode ? (
              <>
                <SunIcon className="mr-2 h-4 w-4" />
                <span>Light Theme</span>
              </>
            ) : (
              <>
                <MoonIcon className="mr-2 h-4 w-4" />
                <span>Dark Theme</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Background Image</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Background Image Selection */}
        <DropdownMenuGroup className="max-h-[200px] overflow-y-auto">
          {BACKGROUND_IMAGES.map((bg) => (
            <DropdownMenuItem
              key={bg.id}
              onClick={() => setBackgroundImage(bg.value)}
              className={
                backgroundImage === bg.value ? "bg-accent font-medium" : ""
              }
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              <span>{bg.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;

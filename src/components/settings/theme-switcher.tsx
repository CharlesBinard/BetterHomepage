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
import useTheme from "@/hooks/use-theme";
import { ImageIcon, MoonIcon, PlusIcon, SunIcon } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const ThemeSwitcher: React.FC = () => {
  const {
    darkMode,
    backgroundImage,
    backgroundBlur,
    backgroundScale,
    switchTheme,
    setBackgroundImage,
    setBackgroundBlur,
    setBackgroundScale,
  } = useTheme();

  const [customUrl, setCustomUrl] = useState(backgroundImage || "");

  const handleCustomUrlSubmit = () => {
    if (customUrl.trim()) {
      setBackgroundImage(customUrl.trim());
    }
  };

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
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
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

        {/* Custom URL Input */}

        <div className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-2 mb-2">
            <Input
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1 h-8"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCustomUrlSubmit();
              }}
            >
              Add
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Cancel
          </Button>
        </div>

        {backgroundImage && (
          <>
            <DropdownMenuSeparator />
            <div
              className="px-2 py-2 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label className="text-xs">Blur: {backgroundBlur}px</Label>
                </div>
                <Slider
                  value={[backgroundBlur]}
                  min={0}
                  max={20}
                  step={1}
                  onValueChange={(values) => setBackgroundBlur(values[0])}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label className="text-xs">Scale: {backgroundScale}%</Label>
                </div>
                <Slider
                  value={[backgroundScale]}
                  min={50}
                  max={150}
                  step={5}
                  onValueChange={(values) => setBackgroundScale(values[0])}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;

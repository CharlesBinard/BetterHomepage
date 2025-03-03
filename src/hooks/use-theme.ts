import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Define theme types
export interface ThemeSettings {
  darkMode: boolean;
  backgroundImage: string | null;
}

const DEFAULT_THEME: ThemeSettings = {
  darkMode: false,
  backgroundImage: null,
};

// Predefined background images
export const BACKGROUND_IMAGES = [
  { id: "none", name: "None", value: null },
  {
    id: "mountain",
    name: "Mountains",
    value:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "forest",
    name: "Forest",
    value:
      "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "cityscape",
    name: "City",
    value:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop",
  },
  {
    id: "desert",
    name: "Desert",
    value:
      "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "night_sky",
    name: "Starry Sky",
    value: "https://images3.alphacoders.com/114/1142030.jpg",
  },
  {
    id: "lake",
    name: "Lake",
    value:
      "https://images.unsplash.com/photo-1511316695145-4992006ffddb?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: "winter",
    name: "Winter",
    value:
      "https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=2108&auto=format&fit=crop",
  },
  {
    id: "aurora",
    name: "Northern Lights",
    value:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "sunset",
    name: "Sunset",
    value:
      "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=2072&auto=format&fit=crop",
  },
];

const useTheme = () => {
  const queryClient = useQueryClient();

  // Get theme settings from local storage
  const { data: theme = DEFAULT_THEME } = useQuery({
    queryKey: ["themeSettings"],
    queryFn: () => {
      const savedTheme = localStorage.getItem("themeSettings");
      if (savedTheme) {
        try {
          return JSON.parse(savedTheme) as ThemeSettings;
        } catch (error) {
          console.error("Error parsing theme settings:", error);
          return DEFAULT_THEME;
        }
      }
      return DEFAULT_THEME;
    },
    initialData: DEFAULT_THEME,
  });

  // Apply theme settings to the document
  useEffect(() => {
    // Apply dark mode
    if (theme.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save theme settings to local storage
    localStorage.setItem("themeSettings", JSON.stringify(theme));
  }, [theme]);

  // Toggle dark mode
  const switchTheme = () => {
    queryClient.setQueryData<ThemeSettings>(["themeSettings"], (old) => ({
      ...old!,
      darkMode: !theme.darkMode,
    }));
  };

  // Set background image
  const setBackgroundImage = (backgroundImage: string | null) => {
    queryClient.setQueryData<ThemeSettings>(["themeSettings"], (old) => ({
      ...old!,
      backgroundImage,
    }));
  };

  return {
    darkMode: theme.darkMode,
    backgroundImage: theme.backgroundImage,
    switchTheme,
    setBackgroundImage,
  };
};

export default useTheme;

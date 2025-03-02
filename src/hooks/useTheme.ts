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
  { id: "none", name: "Aucun", value: null },
  { id: "mountains", name: "Montagnes", value: "/backgrounds/mountains.jpg" },
  { id: "ocean", name: "Océan", value: "/backgrounds/ocean.jpg" },
  { id: "forest", name: "Forêt", value: "/backgrounds/forest.jpg" },
  { id: "city", name: "Ville", value: "/backgrounds/city.jpg" },
  { id: "abstract", name: "Abstrait", value: "/backgrounds/abstract.jpg" },
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

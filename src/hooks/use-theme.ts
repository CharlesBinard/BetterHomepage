import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Define theme types
export interface ThemeSettings {
  darkMode: boolean;
  backgroundImage: string | null;
  backgroundBlur: number;
  backgroundScale: number;
}

const DEFAULT_THEME: ThemeSettings = {
  darkMode: false,
  backgroundImage: null,
  backgroundBlur: 0,
  backgroundScale: 100,
};

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

  // Set background blur (0-20 px)
  const setBackgroundBlur = (blur: number) => {
    queryClient.setQueryData<ThemeSettings>(["themeSettings"], (old) => ({
      ...old!,
      backgroundBlur: Math.min(Math.max(0, blur), 20),
    }));
  };

  // Set background scale (50-150%)
  const setBackgroundScale = (scale: number) => {
    queryClient.setQueryData<ThemeSettings>(["themeSettings"], (old) => ({
      ...old!,
      backgroundScale: Math.min(Math.max(50, scale), 150),
    }));
  };

  return {
    darkMode: theme.darkMode,
    backgroundImage: theme.backgroundImage,
    backgroundBlur: theme.backgroundBlur,
    backgroundScale: theme.backgroundScale,
    switchTheme,
    setBackgroundImage,
    setBackgroundBlur,
    setBackgroundScale,
  };
};

export default useTheme;

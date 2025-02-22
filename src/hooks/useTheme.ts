import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useTheme = () => {
    const queryClient = useQueryClient();

    const { data: darkMode = false } = useQuery({
        queryKey: ["darkMode"],
        queryFn: () => JSON.parse(localStorage.getItem("darkMode") || "false"),
        initialData: false,
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    const switchTheme = () => {
        queryClient.setQueryData(["darkMode"], !darkMode);
    };

    return { darkMode, switchTheme };
};

export default useTheme;

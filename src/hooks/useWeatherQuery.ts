// hooks/useWeatherQuery.ts
import { useQuery } from "@tanstack/react-query";

interface WeatherData {
    temperature: number;
    weathercode: number;
    windspeed: number;
    winddirection: number;
    time: string;
}

const fetchWeather = async (latitude: number, longitude: number): Promise<WeatherData> => {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }

    const dataJson = await response.json();
    const current = dataJson.current_weather;

    return {
        temperature: current.temperature,
        weathercode: current.weathercode,
        windspeed: current.windspeed,
        winddirection: current.winddirection,
        time: current.time,
    };
};

const useWeatherQuery = (latitude: number, longitude: number) => {
    return useQuery({ queryKey: ["weather", latitude, longitude], queryFn: () => fetchWeather(latitude, longitude),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export default useWeatherQuery;

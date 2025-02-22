import { WeatherDataCurrent } from "@/hooks/useWeatherQuery";
import { WEATHER_MAP_CODE } from "@/components/widgets/weather/widget-weather-constant";
import { City } from "@/components/inputs/city-autocomplete";

export interface WidgetWeatherCurrentProps {
    city: City;
    currentWeather?: WeatherDataCurrent;
    displayCity?: boolean;
}

const WidgetWeatherCurrent = ({
                                  currentWeather,
                                  city,
                                  displayCity,
                              }: WidgetWeatherCurrentProps) => {
    const weatherInfo = currentWeather
        ? WEATHER_MAP_CODE[currentWeather.weatherCode]
        : null;

    if (!currentWeather) {
        return (
            <div className="flex items-center justify-center text-gray-500">
                No data available
            </div>
        );
    }

    const isDay = currentWeather.isDay; // Assuming `isDay` is part of the weather data

    // Reusable function for rendering weather cards
    const renderWeatherCard = (label: string, value: string | number, unit?: string) => (
        <div
            className="flex flex-col items-center justify-center w-28 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
        {value}
                {unit}
      </span>
        </div>
    );

    console.log(currentWeather);

    return (
        <div className="flex flex-wrap gap-x-16 items-center justify-center ">
            <div className="flex flex-col items-center gap-0">
                {/* City Name */}
                {displayCity &&
                    <h2 className="text-3xl font-bold tracking-wide">{city.name}</h2>
                }

                {/* Weather Icon */}
                <div className="max-w-28 max-h-28 flex items-center justify-center">
                    {isDay ? weatherInfo?.icon_day : weatherInfo?.icon_night}
                </div>

                {/* Temperature and Description */}
                <div className="flex flex-col items-center gap-1">
                    <div className="text-3xl font-extrabold">
                        {Math.round(currentWeather.temperature)}°C
                    </div>
                    <p className="text-sm font-medium opacity-90">{weatherInfo?.description}</p>
                </div>
            </div>

            {/* Weather Details */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-800 dark:text-gray-200  mt-4">
                {renderWeatherCard("Humidity", currentWeather.humidity.toFixed(0), "%")}
                {renderWeatherCard("Dew Point", currentWeather.dewPoint.toFixed(0), "°C")}
                {renderWeatherCard("Wind", currentWeather.windSpeed.toFixed(0), " km/h")}
                {renderWeatherCard("Wind Direction", currentWeather.windDirection.toFixed(0), "°")}
            </div>
        </div>
    );
};

export default WidgetWeatherCurrent;

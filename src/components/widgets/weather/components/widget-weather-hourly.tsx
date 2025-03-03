import { City } from "@/components/inputs/city-autocomplete";
import { WEATHER_MAP_CODE } from "@/components/widgets/weather/widget-weather-constant";
import { WeatherDataHourly } from "@/hooks/use-weather-query";

export interface WidgetWeatherHourlyProps {
  city: City;
  hourlyForecast?: WeatherDataHourly;
  displayCity?: boolean;
}

const WidgetWeatherHourly = ({
  city,
  hourlyForecast,
  displayCity,
}: WidgetWeatherHourlyProps) => {
  if (!hourlyForecast) {
    return (
      <div className="flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  // Reusable function for rendering hourly forecast cards
  const renderHourlyCard = (
    time: Date,
    weatherCode: number,
    temperature: number,
    precipitation: number
  ) => {
    const forecastInfo = WEATHER_MAP_CODE[weatherCode];

    return (
      <div
        key={time.toISOString()}
        className="flex flex-col items-center justify-center w-20 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        {/* Time */}
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        {/* Weather Icon */}
        <div className="text-2xl my-2">{forecastInfo?.icon_day}</div>

        {/* Temperature */}
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
          {Math.round(temperature)}°C
        </span>

        {/* Precipitation */}
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {precipitation > 0 ? `${precipitation.toFixed(0)} mm` : "No rain"}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* City Name */}
      {displayCity && (
        <h2 className="text-2xl font-bold tracking-wide">{city.name}</h2>
      )}

      {/* Hourly Forecast */}
      <div className="flex flex-wrap justify-center gap-3">
        {hourlyForecast.time
          .slice(0, 12)
          .map((time, index) =>
            renderHourlyCard(
              time,
              hourlyForecast.weatherCode[index],
              hourlyForecast.temperature[index],
              hourlyForecast.precipitation[index]
            )
          )}
      </div>
    </div>
  );
};

export default WidgetWeatherHourly;

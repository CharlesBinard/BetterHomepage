import { City } from "@/components/inputs/city-autocomplete";
import { WEATHER_MAP_CODE } from "@/components/widgets/weather/widget-weather-constant";
import { WeatherDataDaily } from "@/hooks/use-weather-query";

export interface WidgetWeatherDailyProps {
  city: City;
  dailyForecast?: WeatherDataDaily;
  displayCity?: boolean;
}

const WidgetWeatherDaily = ({
  city,
  dailyForecast,
  displayCity,
}: WidgetWeatherDailyProps) => {
  if (!dailyForecast) {
    return (
      <div className="flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const renderDailyCard = (
    time: Date,
    weatherCode: number,
    temperatureMax: number,
    temperatureMin: number
  ) => {
    const forecastInfo = WEATHER_MAP_CODE[weatherCode];

    return (
      <div
        key={time.toISOString()}
        className="flex flex-col items-center justify-center w-24 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        {/* Date */}
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {new Date(time).toLocaleDateString([], { weekday: "short" })}
        </span>

        {/* Weather Icon */}
        <div className="text-3xl my-2">{forecastInfo?.icon_day}</div>

        {/* Temperature */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {Math.round(temperatureMax)}°C
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round(temperatureMin)}°C
          </span>
        </div>

        {/* Weather Description */}
        <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {forecastInfo?.description}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {displayCity && (
        <h2 className="text-2xl font-bold tracking-wide">{city.name}</h2>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        {dailyForecast.time
          .slice(0, 7)
          .map((time, index) =>
            renderDailyCard(
              time,
              dailyForecast.weatherCode[index],
              dailyForecast.temperatureMax[index],
              dailyForecast.temperatureMin[index]
            )
          )}
      </div>
    </div>
  );
};

export default WidgetWeatherDaily;

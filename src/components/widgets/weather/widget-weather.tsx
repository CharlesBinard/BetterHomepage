import { City } from "@/components/inputs/city-autocomplete";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import WidgetBase, {
  defaultBaseData,
  WidgetDataBase,
} from "@/components/widgets/base/widget-base";
import WidgetWeatherCurrent from "@/components/widgets/weather/components/widget-weather-current";
import WidgetWeatherDaily from "@/components/widgets/weather/components/widget-weather-daily";
import WidgetWeatherHourly from "@/components/widgets/weather/components/widget-weather-hourly";
import WidgetWeatherConfigForm from "@/components/widgets/weather/widget-weather-config-form";
import {
  CommonWidgetProps,
  WidgetType,
} from "@/components/widgets/widget-types";
import useWeatherQuery from "@/hooks/use-weather-query";
import useWidgetConfigDialog from "@/hooks/use-widget-config-dialog";
import { Loader2, RefreshCw } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

export interface WidgetWeatherData extends WidgetDataBase {
  type: WidgetType.WEATHER;
  subType?: WidgetWeatherSubType;
  city: City;
  displayCity?: boolean;
}

export enum WidgetWeatherSubType {
  CURRENT = "current",
  HOURLY = "hourly",
  DAILY = "daily",
}

export interface WidgetWeatherProps extends CommonWidgetProps {
  data: WidgetWeatherData;
}

export const defaultWeatherData: WidgetWeatherData = {
  ...defaultBaseData,
  type: WidgetType.WEATHER,
  subType: WidgetWeatherSubType.HOURLY,
  className:
    "bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-slate-700 dark:to-slate-900 shadow-xl rounded-2xl p-4 w-full h-full text-white",
  displayCity: true,
  size: {
    width: 22,
    height: 18,
  },
  city: {
    name: "Paris",
    latitude: 48.8566,
    longitude: 2.3522,
    country: "France",
    postcodes: ["75001"],
  },
};

const WidgetWeather: React.FC<WidgetWeatherProps> = ({
  data,
  onUpdateData,
  ...rest
}) => {
  const { WidgetConfigDialog, closeDialog } = useWidgetConfigDialog();

  // Validate and provide default for data if necessary
  const safeData = useMemo(() => {
    if (!data) return { ...defaultWeatherData };
    return data;
  }, [data]);

  // Use local state to ensure we always have valid data
  const [currentCity, setCurrentCity] = useState<City>(
    safeData.city || defaultWeatherData.city
  );
  const [currentSubType, setCurrentSubType] = useState<string>(
    safeData.subType || WidgetWeatherSubType.HOURLY
  );
  const [showCityName, setShowCityName] = useState<boolean>(
    safeData.displayCity === undefined ? true : safeData.displayCity
  );

  // Update local state when props change
  useEffect(() => {
    if (safeData.city && safeData.city.name) {
      setCurrentCity(safeData.city);
    }
    if (safeData.subType) {
      setCurrentSubType(safeData.subType);
    }
    if (safeData.displayCity !== undefined) {
      setShowCityName(safeData.displayCity);
    }
  }, [safeData]);

  // Ensure we have valid city data before making the query
  const cityLat = currentCity?.latitude || defaultWeatherData.city.latitude;
  const cityLon = currentCity?.longitude || defaultWeatherData.city.longitude;
  const validCity = !!(currentCity?.name && cityLat && cityLon);

  // Get weather data
  const {
    data: weather,
    isLoading,
    isError,
    refetch,
  } = useWeatherQuery(cityLat, cityLon, validCity);

  const currentWeather = weather?.current;
  const hourlyForecast = weather?.hourly;
  const dailyForecast = weather?.daily;

  // Render appropriate sub-widget based on type
  const weatherSubWidget = useMemo(() => {
    try {
      switch (currentSubType) {
        case WidgetWeatherSubType.CURRENT:
          return (
            <WidgetWeatherCurrent
              currentWeather={currentWeather}
              city={currentCity}
              displayCity={showCityName}
            />
          );
        case WidgetWeatherSubType.HOURLY:
          return (
            <WidgetWeatherHourly
              hourlyForecast={hourlyForecast}
              city={currentCity}
              displayCity={showCityName}
            />
          );
        case WidgetWeatherSubType.DAILY:
          return (
            <WidgetWeatherDaily
              dailyForecast={dailyForecast}
              city={currentCity}
              displayCity={showCityName}
            />
          );
        default:
          return (
            <WidgetWeatherCurrent
              currentWeather={currentWeather}
              city={currentCity}
              displayCity={showCityName}
            />
          );
      }
    } catch (error) {
      console.error("Error rendering weather widget:", error);
      return (
        <div className="flex-1 flex items-center justify-center text-red-500">
          Error displaying weather
        </div>
      );
    }
  }, [
    currentCity,
    currentWeather,
    hourlyForecast,
    dailyForecast,
    currentSubType,
    showCityName,
  ]);

  // Handle form submission
  const handleSubmit = (newData: WidgetWeatherData) => {
    try {
      console.log("Updating weather widget with data:", newData);

      // Update local state immediately for responsive UI
      if (newData.city && newData.city.name) {
        setCurrentCity(newData.city);
      }

      if (newData.subType) {
        setCurrentSubType(newData.subType);
      }

      if (newData.displayCity !== undefined) {
        setShowCityName(newData.displayCity);
      }

      // Persist changes
      onUpdateData(safeData.id, {
        ...safeData,
        ...newData,
        city: newData.city || currentCity,
        subType:
          (newData.subType as WidgetWeatherSubType) ||
          (currentSubType as WidgetWeatherSubType),
        displayCity:
          newData.displayCity === undefined
            ? showCityName
            : newData.displayCity,
      });

      closeDialog();

      // Refresh weather data with new settings
      setTimeout(() => refetch(), 300);
    } catch (error) {
      console.error("Error updating weather widget:", error);
    }
  };

  return (
    <WidgetBase data={safeData} {...rest}>
      <WidgetConfigDialog type={WidgetType.WEATHER}>
        <WidgetWeatherConfigForm
          data={{
            ...safeData,
            city: currentCity,
            subType: currentSubType as WidgetWeatherSubType,
            displayCity: showCityName,
          }}
          onSubmit={handleSubmit}
        />
      </WidgetConfigDialog>

      <Button
        onClick={() => refetch()}
        disabled={isLoading}
        size="icon"
        variant="ghost"
        className="absolute top-10 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Refresh Weather Data"
      >
        {isLoading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <RefreshCw className="w-5 h-5" />
        )}
      </Button>

      <ScrollArea className="w-full h-full">
        {validCity ? (
          <div>
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                  <div className="h-12 w-12 bg-blue-200 dark:bg-slate-600 rounded-full" />
                  <div className="h-4 bg-blue-200 dark:bg-slate-600 rounded w-32" />
                </div>
              </div>
            ) : isError ? (
              <div className="flex-1 flex items-center justify-center text-red-500">
                Failed to load weather data
              </div>
            ) : currentWeather ? (
              <div className="w-full">{weatherSubWidget}</div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                No data available
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            No city selected
          </div>
        )}
      </ScrollArea>
    </WidgetBase>
  );
};

export default WidgetWeather;

// widget-weather.tsx
import React from "react";
import WidgetBase, { defaultBaseConfig } from "@/components/widgets/base/widget-base";
import { CommonWidgetProps, WidgetData, WidgetType } from "@/components/widgets/widget-types";
import useWidgetConfigDialog from "@/hooks/useWidgetConfigDialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import WidgetWeatherConfigForm, { WidgetWeatherConfig } from "@/components/widgets/weather/widget-weather-config-form";
import useWeatherQuery from "@/hooks/useWeatherQuery";

export interface WidgetWeatherProps extends CommonWidgetProps {
    data: WidgetData<WidgetWeatherConfig> & { type: WidgetType.WEATHER };
    onUpdateConfig: (id: string, config: WidgetWeatherConfig) => void;
}

export const defaultWeatherConfig: WidgetWeatherConfig = {
    ...defaultBaseConfig,
    city: {
        name: "Paris",
        latitude: 48.8566,
        longitude: 2.3522,
        country: "France",
    },
};

const WidgetWeather: React.FC<WidgetWeatherProps> = ({
                                                         data,
                                                         onUpdateConfig,
                                                         ...rest
                                                     }) => {
    const { WidgetConfigDialog, closeDialog } = useWidgetConfigDialog();
    const config = { ...defaultWeatherConfig, ...data.config };

    const { data: weather, isLoading, isError, refetch } = useWeatherQuery(
        config.city.latitude,
        config.city.longitude
    );

    console.log(isLoading);

    return (
        <WidgetBase data={data} {...rest}>
            <WidgetConfigDialog type={WidgetType.WEATHER}>
                <WidgetWeatherConfigForm
                    config={config}
                    onSubmit={(newConfig) => {
                        onUpdateConfig(data.id, newConfig);
                        closeDialog();
                    }}
                />
            </WidgetConfigDialog>

            <ScrollArea>
                <div className="flex flex-col space-y-4 justify-between items-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Weather in {config.city.name}
                    </div>
                    <div>
                        {isLoading ? (
                            <p className="text-sm text-gray-700 dark:text-gray-300">Loading...</p>
                        ) : isError ? (
                            <p className="text-sm text-red-500">Error fetching weather data</p>
                        ) : weather ? (
                            <div className="flex flex-col space-y-2">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Temperature:</span> {weather.temperature}°C
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Wind Speed:</span> {weather.windspeed} km/h
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Wind Direction:</span> {weather.winddirection}°
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Weather Code:</span> {weather.weathercode}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-700 dark:text-gray-300">No data available</p>
                        )}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button disabled={isLoading} variant="secondary" onClick={() => refetch()}>
                            Refresh
                        </Button>
                    </div>
                </div>
            </ScrollArea>
        </WidgetBase>
    );
};

export default WidgetWeather;

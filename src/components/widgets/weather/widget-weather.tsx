import React, {useMemo} from "react";
import WidgetBase, {
    defaultBaseData,
    WidgetDataBase,
} from "@/components/widgets/base/widget-base";
import {CommonWidgetProps, WidgetType} from "@/components/widgets/widget-types";
import useWidgetConfigDialog from "@/hooks/useWidgetConfigDialog";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import WidgetWeatherConfigForm from "@/components/widgets/weather/widget-weather-config-form";
import useWeatherQuery from "@/hooks/useWeatherQuery";
import {RefreshCw, Loader2} from "lucide-react";
import {City} from "@/components/inputs/city-autocomplete";
import WidgetWeatherCurrent from "@/components/widgets/weather/components/widget-weather-current";
import WidgetWeatherHourly from "@/components/widgets/weather/components/widget-weather-hourly";
import WidgetWeatherDaily from "@/components/widgets/weather/components/widget-weather-daily";

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
    className: "bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-slate-700 dark:to-slate-900 shadow-xl rounded-2xl p-4 w-full h-full text-white",
    displayCity: true,
    size: {
        width: 250,
        height: 250,
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
    const {WidgetConfigDialog, closeDialog} = useWidgetConfigDialog();

    const {data: weather, isLoading, isError, refetch} = useWeatherQuery(
        data.city?.latitude || 0,
        data.city?.longitude || 0,
        !!data.city
    );

    const currentWeather = weather?.current;
    const hourlyForecast = weather?.hourly;
    const dailyForecast = weather?.daily;

    const weatherSubWidget = useMemo(() => {
        switch (data.subType) {
            case WidgetWeatherSubType.CURRENT:
                return <WidgetWeatherCurrent currentWeather={currentWeather} city={data.city} displayCity={data.displayCity}/>;
            case WidgetWeatherSubType.HOURLY:
                return <WidgetWeatherHourly hourlyForecast={hourlyForecast} city={data.city} displayCity={data.displayCity}/>;
            case WidgetWeatherSubType.DAILY:
                return <WidgetWeatherDaily dailyForecast={dailyForecast} city={data.city} displayCity={data.displayCity}/>;
            default:
                return <WidgetWeatherCurrent currentWeather={currentWeather} city={data.city} displayCity={data.displayCity}/>;
        }
    }, [data, currentWeather, hourlyForecast, dailyForecast]);

    return (
        <WidgetBase data={data} {...rest}>
            <WidgetConfigDialog type={WidgetType.WEATHER}>
                <WidgetWeatherConfigForm
                    data={data}
                    onSubmit={(newData) => {
                        onUpdateData(data.id, newData);
                        closeDialog();
                    }}
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
                    <Loader2 className="animate-spin w-5 h-5"/>
                ) : (
                    <RefreshCw className="w-5 h-5"/>
                )}
            </Button>

            <ScrollArea className="w-full h-full" >
                    {data.city ? (
                        <div >
                            {isLoading ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="animate-pulse flex flex-col items-center space-y-4">
                                        <div className="h-12 w-12 bg-blue-200 dark:bg-slate-600 rounded-full"/>
                                        <div className="h-4 bg-blue-200 dark:bg-slate-600 rounded w-32"/>
                                    </div>
                                </div>
                            ) : isError ? (
                                <div className="flex-1 flex items-center justify-center text-red-500">
                                    Failed to load weather data
                                </div>
                            ) : currentWeather ? (
                                <div className="w-full">
                                    {weatherSubWidget}
                                </div>
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

// hooks/useWeatherQuery.ts
import { useQuery } from "@tanstack/react-query";
import { fetchWeatherApi } from "openmeteo";

// Define minimal local types matching the API response structure.
interface FlatVariable {
    value(): number;
    valuesArray(): number[] | null;
    valuesInt64Length?(): number;
    valuesInt64?(i: number): number | bigint;
}

interface FlatVariablesWithTime {
    time(): number;
    timeEnd(): number;
    interval(): number;
    variables(index: number): FlatVariable | null;
}

export interface WeatherDataHourly {
    time: Date[];
    weatherCode: number[];
    temperature: number[];
    precipitation: number[];
    windSpeed: number[];
    windDirection: number[];
    dewPoint: number[];
    humidity: number[];
    apparentTemperature?: number[];
    precipitationProbability?: number[];
    isDay: number[];
}

export interface WeatherDataCurrent {
    time: Date;
    weatherCode: number;
    temperature: number;
    windSpeed: number;
    windDirection: number;
    precipitation?: number;
    dewPoint: number;
    humidity: number;
    apparentTemperature?: number;
    precipitationProbability?: number;
    isDay: number;
}

export interface WeatherDataDaily {
    time: Date[];
    weatherCode: number[];
    temperatureMax: number[];
    temperatureMin: number[];
    sunrise?: Array<Date | null>;
    sunset?: Array<Date | null>;
    windSpeedMax?: number[];
    windGustsMax?: number[];
    windDirectionDominant?: number[];
    precipitationSum?: number[];
}



export interface WeatherData {
    current: WeatherDataCurrent
    hourly: WeatherDataHourly;
    daily: WeatherDataDaily;
}

const HOURLY_REQUEST_PARAMS = [
    "temperature_2m",
    "weather_code",
    "wind_speed_10m",
    "wind_direction_10m",
    "precipitation",
    "dew_point_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "precipitation_probability",
    "is_day"
];

const DAILY_REQUEST_PARAMS = [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_sum",
    "wind_speed_10m_max",
    "wind_gusts_10m_max",
    "wind_direction_10m_dominant",
    "sunrise",
    "sunset",
];

const range = (start: number, stop: number, step: number): number[] =>
    Array.from(
        { length: Math.ceil((stop - start) / step) },
        (_, i) => start + i * step
    );

const getVariableArray = (
    source: FlatVariablesWithTime,
    index: number
): number[] => {
    const variable = source.variables(index);
    if (!variable) return [];
    const values = variable.valuesArray();
    return values ? Array.from(values) : [];
};

const sunToArray = (
    source: FlatVariablesWithTime,
    index: number): Array<Date | null> => {
    const variable = source.variables(index);
    if (!variable) return [];
    const count = variable.valuesInt64Length ? variable.valuesInt64Length() : 0;
    return Array.from({ length: count }, (_, i) => {
        const value = variable.valuesInt64 ? variable.valuesInt64(i) : 0;
        return value ? new Date(Number(value) * 1000) : null;
    });
};

const fetchWeather = async (
    lat: number,
    long: number
): Promise<WeatherData> => {
    const url = "https://api.open-meteo.com/v1/forecast";
    const params = {
        latitude: [lat],
        longitude: [long],
        current: HOURLY_REQUEST_PARAMS,
        hourly: HOURLY_REQUEST_PARAMS,
        daily: DAILY_REQUEST_PARAMS,
    };

    const [response] = await fetchWeatherApi(url, params);

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const currentData = response.current()! as unknown as FlatVariablesWithTime;
    const hourlyData = response.hourly()! as unknown as FlatVariablesWithTime;
    const dailyData = response.daily()! as unknown as FlatVariablesWithTime;

    const formatTime = (unixTime: number): Date =>
        new Date((unixTime + utcOffsetSeconds) * 1000);

    return {
        current: {
            time: formatTime(Number(currentData.time())),
            temperature: currentData.variables(0)!.value(),
            weatherCode: currentData.variables(1)!.value(),
            windSpeed: currentData.variables(2)!.value(),
            windDirection: currentData.variables(3)!.value(),
            precipitation: currentData.variables(4)!.value(),
            dewPoint: currentData.variables(5)!.value(),
            humidity: currentData.variables(6)!.value(),
            apparentTemperature: currentData.variables(7)?.value(),
            precipitationProbability: currentData.variables(8)?.value(),
            isDay: currentData.variables(9)!.value(),
        },
        hourly: {
            time: range(
                Number(hourlyData.time()),
                Number(hourlyData.timeEnd()),
                hourlyData.interval()
            ).map(formatTime),
            temperature: getVariableArray(hourlyData, 0),
            weatherCode: getVariableArray(hourlyData, 1),
            precipitation: getVariableArray(hourlyData, 2),
            windSpeed: getVariableArray(hourlyData, 3),
            windDirection: getVariableArray(hourlyData, 4),
            dewPoint: getVariableArray(hourlyData, 5),
            humidity: getVariableArray(hourlyData, 6),
            apparentTemperature: getVariableArray(hourlyData, 7),
            precipitationProbability: getVariableArray(hourlyData, 8),
            isDay: getVariableArray(hourlyData, 9),
        },

        daily: {
            time: range(
                Number(dailyData.time()),
                Number(dailyData.timeEnd()),
                dailyData.interval()
            ).map(formatTime),
            weatherCode: getVariableArray(dailyData, 0),
            temperatureMax: getVariableArray(dailyData, 1),
            temperatureMin: getVariableArray(dailyData, 2),
            precipitationSum: getVariableArray(dailyData, 3),
            windSpeedMax: getVariableArray(dailyData, 4),
            windGustsMax: getVariableArray(dailyData, 5),
            windDirectionDominant: getVariableArray(dailyData, 6),
            sunrise: sunToArray(dailyData, 7),
            sunset: sunToArray(dailyData, 8),
        },
    };
};

const useWeatherQuery = (
    latitude: number,
    longitude: number,
    enabled: boolean = true
) => {
    return useQuery<WeatherData>({
        queryKey: ["weather", latitude, longitude],
        queryFn: () => fetchWeather(latitude, longitude),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        enabled: enabled && !!latitude && !!longitude,
        refetchOnWindowFocus: false,
    });
};

export default useWeatherQuery;

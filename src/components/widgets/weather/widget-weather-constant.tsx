import React, { ReactNode } from "react";
import dynamic from "next/dynamic";

// Dynamically import Lottie to prevent SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Import Lottie animations
import ClearDayAnimated from "~/lottie/weather/clear-day.json";
import ClearNightAnimated from "~/lottie/weather/clear-night.json";
import PartlyCloudyDayAnimated from "~/lottie/weather/partly-cloudy-day.json";
import PartlyCloudyNightAnimated from "~/lottie/weather/partly-cloudy-night.json";
import OvercastDayAnimated from "~/lottie/weather/overcast-day.json";
import OvercastNightAnimated from "~/lottie/weather/overcast-night.json";
import FogDayAnimated from "~/lottie/weather/fog-day.json";
import FogNightAnimated from "~/lottie/weather/fog-night.json";
import DrizzleAnimated from "~/lottie/weather/drizzle.json";
import RainAnimated from "~/lottie/weather/rain.json";
import SnowAnimated from "~/lottie/weather/snow.json";
import ThunderstormDayAnimated from "~/lottie/weather/thunderstorms-day.json";
import ThunderstormNightAnimated from "~/lottie/weather/thunderstorms-night.json";
import DustDayAnimated from "~/lottie/weather/dust-day.json";
import DustNightAnimated from "~/lottie/weather/dust-night.json";
import HazeDayAnimated from "~/lottie/weather/haze-day.json";
import HazeNightAnimated from "~/lottie/weather/haze-night.json";
import MistAnimated from "~/lottie/weather/mist.json";
import TornadoAnimated from "~/lottie/weather/tornado.json";
import HailAnimated from "~/lottie/weather/hail.json";
import ExtremeRainAnimated from "~/lottie/weather/extreme-rain.json";
import ExtremeSnowAnimated from "~/lottie/weather/extreme-snow.json";
import ThunderstormDayExtremeAnimated from "~/lottie/weather/thunderstorms-day-extreme.json";
import ThunderstormNightExtremeAnimated from "~/lottie/weather/thunderstorms-night-extreme.json";

export const WEATHER_MAP_CODE: Record<
    number,
    { description: string; icon_day: ReactNode; icon_night: ReactNode }
> = {
    // Clear Sky
    0: {
        description: "Clear Sky",
        icon_day: <Lottie animationData={ClearDayAnimated} loop />,
        icon_night: <Lottie animationData={ClearNightAnimated} loop />,
    },
    // Mainly Clear
    1: {
        description: "Mainly Clear",
        icon_day: <Lottie animationData={ClearDayAnimated} loop />,
        icon_night: <Lottie animationData={ClearNightAnimated} loop />,
    },
    // Partly Cloudy
    2: {
        description: "Partly Cloudy",
        icon_day: <Lottie animationData={PartlyCloudyDayAnimated} loop />,
        icon_night: <Lottie animationData={PartlyCloudyNightAnimated} loop />,
    },
    // Overcast
    3: {
        description: "Overcast",
        icon_day: <Lottie animationData={OvercastDayAnimated} loop />,
        icon_night: <Lottie animationData={OvercastNightAnimated} loop />,
    },
    // Dust or Sand
    7: {
        description: "Dust or Sand",
        icon_day: <Lottie animationData={DustDayAnimated} loop />,
        icon_night: <Lottie animationData={DustNightAnimated} loop />,
    },
    // Foggy
    45: {
        description: "Foggy",
        icon_day: <Lottie animationData={FogDayAnimated} loop />,
        icon_night: <Lottie animationData={FogNightAnimated} loop />,
    },
    // Haze
    5: {
        description: "Haze",
        icon_day: <Lottie animationData={HazeDayAnimated} loop />,
        icon_night: <Lottie animationData={HazeNightAnimated} loop />,
    },
    // Mist
    10: {
        description: "Mist",
        icon_day: <Lottie animationData={MistAnimated} loop />,
        icon_night: <Lottie animationData={MistAnimated} loop />,
    },
    // Drizzle
    51: {
        description: "Drizzle",
        icon_day: <Lottie animationData={DrizzleAnimated} loop />,
        icon_night: <Lottie animationData={DrizzleAnimated} loop />,
    },
    // Rain
    61: {
        description: "Rain",
        icon_day: <Lottie animationData={RainAnimated} loop />,
        icon_night: <Lottie animationData={RainAnimated} loop />,
    },
    // Rain Showers (Slight)
    80: {
        description: "Rain Showers (Slight)",
        icon_day: <Lottie animationData={PartlyCloudyDayAnimated} loop />,
        icon_night: <Lottie animationData={PartlyCloudyNightAnimated} loop />,
    },
    // Rain Showers (Moderate or Heavy)
    81: {
        description: "Rain Showers (Moderate or Heavy)",
        icon_day: <Lottie animationData={RainAnimated} loop />,
        icon_night: <Lottie animationData={RainAnimated} loop />,
    },
    // Rain Showers (Violent)
    82: {
        description: "Rain Showers (Violent)",
        icon_day: <Lottie animationData={ExtremeRainAnimated} loop />,
        icon_night: <Lottie animationData={ExtremeRainAnimated} loop />,
    },
    // Snow
    71: {
        description: "Snow",
        icon_day: <Lottie animationData={SnowAnimated} loop />,
        icon_night: <Lottie animationData={SnowAnimated} loop />,
    },
    // Heavy Snow
    39: {
        description: "Heavy Snow",
        icon_day: <Lottie animationData={SnowAnimated} loop />,
        icon_night: <Lottie animationData={SnowAnimated} loop />,
    },
    // Thunderstorm
    95: {
        description: "Thunderstorm",
        icon_day: <Lottie animationData={ThunderstormDayAnimated} loop />,
        icon_night: <Lottie animationData={ThunderstormNightAnimated} loop />,
    },
    // Thunderstorm with Rain
    97: {
        description: "Thunderstorm with Rain",
        icon_day: <Lottie animationData={ThunderstormDayAnimated} loop />,
        icon_night: <Lottie animationData={ThunderstormNightAnimated} loop />,
    },
    // Tornado
    19: {
        description: "Tornado",
        icon_day: <Lottie animationData={TornadoAnimated} loop />,
        icon_night: <Lottie animationData={TornadoAnimated} loop />,
    },
    // Hail
    27: {
        description: "Hail",
        icon_day: <Lottie animationData={HailAnimated} loop />,
        icon_night: <Lottie animationData={HailAnimated} loop />,
    },
    // Duststorm
    30: {
        description: "Duststorm",
        icon_day: <Lottie animationData={DustDayAnimated} loop />,
        icon_night: <Lottie animationData={DustNightAnimated} loop />,
    },
    // Severe Duststorm
    33: {
        description: "Severe Duststorm",
        icon_day: <Lottie animationData={DustDayAnimated} loop />,
        icon_night: <Lottie animationData={DustNightAnimated} loop />,
    },
    // Extreme Rain
    99: {
        description: "Extreme Rain",
        icon_day: <Lottie animationData={ExtremeRainAnimated} loop />,
        icon_night: <Lottie animationData={ExtremeRainAnimated} loop />,
    },
    // Extreme Snow
    100: {
        description: "Extreme Snow",
        icon_day: <Lottie animationData={ExtremeSnowAnimated} loop />,
        icon_night: <Lottie animationData={ExtremeSnowAnimated} loop />,
    },
    // Extreme Thunderstorm
    101: {
        description: "Extreme Thunderstorm",
        icon_day: <Lottie animationData={ThunderstormDayExtremeAnimated} loop />,
        icon_night: <Lottie animationData={ThunderstormNightExtremeAnimated} loop />,
    },
};

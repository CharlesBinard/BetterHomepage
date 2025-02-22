// widget-constants.ts
import {WidgetData, WidgetType} from "./widget-types";
import { defaultWeatherData } from "./weather/widget-weather";
import { defaultBookmarkData } from "./bookmark/widget-bookmark";
import { defaultIframeData } from "./iframe/widget-iframe";
import { Bookmark, CloudSun, ScreenShare } from "lucide-react";
import React from "react";

export interface WidgetDefaultConfig {
    title: string;
    description: string;
    type: WidgetType;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    defaultData: WidgetData;
    color: string;
}

export const DEFAULT_WIDGET_CONFIGS: Record<WidgetType, WidgetDefaultConfig> = {
    [WidgetType.WEATHER]: {
        title: "Weather",
        description: "Weather of your city",
        type: WidgetType.WEATHER,
        icon: CloudSun,
        defaultData: defaultWeatherData,
        color: "#32a852",
    },
    [WidgetType.BOOKMARK]: {
        title: "Bookmark",
        description: "Bookmarks of your favorite websites",
        type: WidgetType.BOOKMARK,
        icon: Bookmark,
        defaultData: defaultBookmarkData,
        color: "#3256a8",
    },
    [WidgetType.IFRAME]: {
        title: "Iframe",
        description: "Iframe to any compatible website",
        type: WidgetType.IFRAME,
        icon: ScreenShare,
        defaultData: defaultIframeData,
        color: "#a87f32",
    },
};

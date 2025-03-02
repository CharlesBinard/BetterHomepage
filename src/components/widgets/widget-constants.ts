// widget-constants.ts
import { Bookmark, Clock, CloudSun, ScreenShare, Search } from "lucide-react";
import React from "react";
import { defaultBookmarkData } from "./bookmark/widget-bookmark";
import { defaultDatetimeData } from "./datetime/widget-datetime";
import { defaultIframeData } from "./iframe/widget-iframe";
import { defaultSearchData } from "./search/widget-search";
import { defaultWeatherData } from "./weather/widget-weather";
import { WidgetData, WidgetType } from "./widget-types";

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
  [WidgetType.DATETIME]: {
    title: "Date & Time",
    description: "Display date and time in various formats",
    type: WidgetType.DATETIME,
    icon: Clock,
    defaultData: defaultDatetimeData,
    color: "#9932a8",
  },
  [WidgetType.SEARCH]: {
    title: "Search",
    description: "Search in your favorite search engine",
    type: WidgetType.SEARCH,
    icon: Search,
    defaultData: defaultSearchData,
    color: "#a83232",
  },
};

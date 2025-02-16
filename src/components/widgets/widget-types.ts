// widget-types.ts
import { BoxPosition, BoxSize } from "@/components/draggable-resizable-box";
import { WidgetWeatherConfig } from "@/components/widgets/weather/widget-weather-config-form";
import { WidgetBookmarkConfig } from "@/components/widgets/bookmark/widget-bookmark-config-form";
import {WidgetIframeConfig} from "@/components/widgets/iframe/widget-iframe-config-from";

export enum WidgetType {
    WEATHER = "weather",
    BOOKMARK = "bookmark",
    IFRAME = "iframe",
}

export interface CommonWidgetProps {
    onUpdatePosition: (id: string, pos: BoxPosition) => void;
    onUpdateSize: (id: string, pos: BoxSize) => void;
    onDelete: (id: string) => void;
}


export interface WidgetBaseConfig {
    className?: string;
    zIndex?: number;
}

export type WidgetConfig =
    | WidgetWeatherConfig
    | WidgetBookmarkConfig
    | WidgetIframeConfig;

export interface WidgetData<T extends WidgetConfig = WidgetConfig> {
    id: string;
    type: WidgetType;
    size: BoxSize;
    position: BoxPosition;
    config?: T;
}

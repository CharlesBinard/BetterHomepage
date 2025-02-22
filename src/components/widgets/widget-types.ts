// widget-types.ts
import { BoxSize } from "@/components/draggable-resizable-box";
import {WidgetIframeData} from "@/components/widgets/iframe/widget-iframe";
import {WidgetBookmarkData} from "@/components/widgets/bookmark/widget-bookmark";
import {WidgetWeatherData} from "@/components/widgets/weather/widget-weather";

export enum WidgetType {
    WEATHER = "weather",
    BOOKMARK = "bookmark",
    IFRAME = "iframe",
}

export interface CommonWidgetProps {
    onUpdateSize: (id: string, pos: BoxSize) => void;
    onDelete: (id: string) => void;
    onUpdateData: (id: string, newConfig: WidgetData) => void;
}

export type WidgetData =
    | WidgetWeatherData
    | WidgetBookmarkData
    | WidgetIframeData;
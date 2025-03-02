// widget-types.ts
import { BoxSize } from "@/components/ui/draggable-resizable-box";
import { WidgetBookmarkData } from "@/components/widgets/bookmark/widget-bookmark";
import { WidgetDatetimeData } from "@/components/widgets/datetime/widget-datetime";
import { WidgetIframeData } from "@/components/widgets/iframe/widget-iframe";
import { WidgetSearchData } from "@/components/widgets/search/widget-search";
import { WidgetWeatherData } from "@/components/widgets/weather/widget-weather";

export enum WidgetType {
  WEATHER = "weather",
  BOOKMARK = "bookmark",
  IFRAME = "iframe",
  DATETIME = "datetime",
  SEARCH = "search",
}

export interface CommonWidgetProps {
  onUpdateSize: (id: string, pos: BoxSize) => void;
  onDelete: (id: string) => void;
  onUpdateData: (id: string, newConfig: WidgetData) => void;
}

export type WidgetData =
  | WidgetWeatherData
  | WidgetBookmarkData
  | WidgetIframeData
  | WidgetDatetimeData
  | WidgetSearchData;

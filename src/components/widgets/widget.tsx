// Widget.tsx
import WidgetBookmark from "@/components/widgets/bookmark/widget-bookmark";
import WidgetDatetime from "@/components/widgets/datetime/widget-datetime";
import WidgetIframe from "@/components/widgets/iframe/widget-iframe";
import WidgetWeather from "@/components/widgets/weather/widget-weather";
import {
  CommonWidgetProps,
  WidgetData,
  WidgetType,
} from "@/components/widgets/widget-types";
import { memo } from "react";
import WidgetSearch from "./search/widget-search";

export interface WidgetProps extends CommonWidgetProps {
  data: WidgetData;
}

const Widget = memo((props: WidgetProps) => {
  const { data } = props;
  switch (data.type) {
    case WidgetType.WEATHER:
      return <WidgetWeather {...props} data={data} />;
    case WidgetType.BOOKMARK:
      return <WidgetBookmark {...props} data={data} />;
    case WidgetType.IFRAME:
      return <WidgetIframe {...props} data={data} />;
    case WidgetType.DATETIME:
      return <WidgetDatetime {...props} data={data} />;
    case WidgetType.SEARCH:
      return <WidgetSearch {...props} data={data} />;
    default:
      return null;
  }
});

Widget.displayName = "Widget";

export default Widget;

// Widget.tsx
import React, { memo } from "react";
import WidgetWeather from "@/components/widgets/weather/widget-weather";
import WidgetIframe from "@/components/widgets/iframe/widget-iframe";
import WidgetBookmark from "@/components/widgets/bookmark/widget-bookmark";
import { WidgetType, CommonWidgetProps, WidgetData } from "@/components/widgets/widget-types";

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
        default:
            return null;
    }
});

Widget.displayName = "Widget";

export default Widget;

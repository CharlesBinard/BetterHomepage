// Widget.tsx
import React, { memo } from "react";
import WidgetWeather, {WidgetWeatherProps} from "@/components/widgets/weather/widget-weather";
import WidgetIframe, {WidgetIframeProps} from "@/components/widgets/iframe/widget-iframe";
import WidgetBookmark, {WidgetBookmarkProps} from "@/components/widgets/bookmark/widget-bookmark";
import { WidgetType } from "@/components/widgets/widget-types";


export type WidgetProps = WidgetWeatherProps | WidgetIframeProps | WidgetBookmarkProps;

const isWeatherWidget = (props: WidgetProps): props is WidgetWeatherProps =>{
    return props.data.type === WidgetType.WEATHER;
}

const isBookmarkWidget = (props: WidgetProps): props is WidgetBookmarkProps => {
    return props.data.type === WidgetType.BOOKMARK;
}

const isIframeWidget = (props: WidgetProps): props is WidgetIframeProps  =>{
    return props.data.type === WidgetType.IFRAME;
}

const Widget = memo((props: WidgetProps) => {
    if (isWeatherWidget(props)) {
        return <WidgetWeather {...props} />;
    } else if (isBookmarkWidget(props)) {
        return <WidgetBookmark {...props} />;
    } else if (isIframeWidget(props)) {
        return <WidgetIframe {...props} />;
    }
    return null;
});

Widget.displayName = "Widget";

export default Widget;

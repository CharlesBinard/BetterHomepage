"use client";

import React from "react";
import WidgetBase, {defaultBaseConfig} from "@/components/widgets/base/widget-base";
import {CommonWidgetProps, WidgetData, WidgetType} from "@/components/widgets/widget-types";
import WidgetIframeConfigForm, {WidgetIframeConfig} from "@/components/widgets/iframe/widget-iframe-config-from";
import useWidgetConfigDialog from "@/hooks/useWidgetConfigDialog";

export interface WidgetIframeProps extends CommonWidgetProps {
    data: WidgetData<WidgetIframeConfig> & { type: WidgetType.IFRAME };
    onUpdateConfig: (id: string, config: WidgetIframeConfig) => void;
}

export const defaultIframeConfig: WidgetIframeConfig = {
    ...defaultBaseConfig,
    url: "https://www.google.com",
    iframeClassName: "rounded-lg"
};

const WidgetIframe: React.FC<WidgetIframeProps> = ({
                                                       data,
                                                       onUpdateConfig,
                                                       ...rest
                                                   }) => {

    const {WidgetConfigDialog, closeDialog} = useWidgetConfigDialog();

    const config = {
        ...defaultIframeConfig,
        ...data.config,
    }

    return (
        <WidgetBase data={data} {...rest}>
            <WidgetConfigDialog type={WidgetType.IFRAME}>
                <WidgetIframeConfigForm
                    config={config}
                    onSubmit={(newConfig) => {
                        console.log(newConfig);
                        onUpdateConfig(data.id, newConfig);
                        closeDialog();
                    }}
                />
            </WidgetConfigDialog>

            <iframe
                src={config.url}
                className={`w-full h-full ${config.iframeClassName}`}
                title="Widget Iframe"
                seamless
            />
        </WidgetBase>
    );
};

export default WidgetIframe;

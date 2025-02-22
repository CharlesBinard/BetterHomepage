"use client";

import React, {HTMLAttributeReferrerPolicy, useState} from "react";
import WidgetBase, { defaultBaseData, WidgetDataBase } from "@/components/widgets/base/widget-base";
import { CommonWidgetProps, WidgetType } from "@/components/widgets/widget-types";
import WidgetIframeConfigForm from "@/components/widgets/iframe/widget-iframe-config-from";
import useWidgetConfigDialog from "@/hooks/useWidgetConfigDialog";

export interface WidgetIframeData extends WidgetDataBase {
    type: WidgetType.IFRAME;
    url?: string;
    iframeClassName?: string;
    sandbox?: string;
    allow?: string;
    loading?: "lazy" | "eager";
    referrerPolicy?: HTMLAttributeReferrerPolicy;
}

export interface WidgetIframeProps extends CommonWidgetProps {
    data: WidgetIframeData;
}

export const defaultIframeData: WidgetIframeData = {
    ...defaultBaseData,
    size: {
        width: 500,
        height: 500,
    },
    type: WidgetType.IFRAME,
    url: "https://www.google.com",
    className: "shadow-xl rounded-2xl w-full h-full text-white",
    iframeClassName: "rounded-2xl",
    sandbox: "allow-scripts allow-same-origin",
    allow: "fullscreen",
    loading: "lazy",
    referrerPolicy: "no-referrer",
};

const WidgetIframe: React.FC<WidgetIframeProps> = ({
                                                       data,
                                                       onUpdateData,
                                                       ...rest
                                                   }) => {
    const { WidgetConfigDialog, closeDialog } = useWidgetConfigDialog();
    const [isLoading, setIsLoading] = useState(true);

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    return (
        <WidgetBase data={data} {...rest}>
            {/* Configuration Dialog */}
            <WidgetConfigDialog type={WidgetType.IFRAME}>
                <WidgetIframeConfigForm
                    data={data}
                    onSubmit={(newData) => {
                        onUpdateData(data.id, newData);
                        closeDialog();
                    }}
                />
            </WidgetConfigDialog>

            {/* iFrame Content */}
            <div className="relative w-full h-full">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <p className="text-sm text-gray-500">Loading...</p>
                    </div>
                )}

                {data.url ? (
                    <iframe
                        src={data.url}
                        className={`w-full h-full ${data.iframeClassName}`}
                        title="Widget Iframe"
                        sandbox={data.sandbox}
                        allow={data.allow}
                        loading={data.loading}
                        referrerPolicy={data.referrerPolicy}
                        onLoad={handleIframeLoad}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <p className="text-sm text-gray-500">No URL selected</p>
                    </div>
                )}
            </div>
        </WidgetBase>
    );
};

export default WidgetIframe;

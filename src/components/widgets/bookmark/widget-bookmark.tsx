// WidgetBookmark.tsx
import React from "react";
import WidgetBase, {defaultBaseConfig} from "@/components/widgets/base/widget-base";
import {CommonWidgetProps, WidgetData, WidgetType} from "@/components/widgets/widget-types";
import WidgetBookmarkConfigForm, {
    WidgetBookmarkConfig,
} from "@/components/widgets/bookmark/widget-bookmark-config-form";
import useWidgetConfigDialog from "@/hooks/useWidgetConfigDialog";

export interface WidgetBookmarkProps extends CommonWidgetProps {
    data: WidgetData<WidgetBookmarkConfig> & { type: WidgetType.BOOKMARK };
    onUpdateConfig: (id: string, config: WidgetBookmarkConfig) => void;
}

export const defaultBookmarkConfig: WidgetBookmarkConfig = {
    ...defaultBaseConfig,
    bookmarksContainerClassName: "flex flex-col gap-2",
    bookmarks: [
        {
            text: "Google",
            url: "https://google.com",
            logo: "",
        },
    ],
};

const WidgetBookmark: React.FC<WidgetBookmarkProps> = ({
                                                           data,
                                                           onUpdateConfig,
                                                           ...rest
                                                       }) => {
    const {WidgetConfigDialog, closeDialog} = useWidgetConfigDialog();
    const config: WidgetBookmarkConfig = {
        ...defaultBookmarkConfig,
        ...data.config,
    };

    return (
        <WidgetBase data={data} {...rest}>
            <WidgetConfigDialog type={WidgetType.BOOKMARK}>
                <WidgetBookmarkConfigForm
                    config={config}
                    onSubmit={(newConfig) => {
                        onUpdateConfig(data.id, newConfig);
                        closeDialog();
                    }}
                />
            </WidgetConfigDialog>

            <div className={config.bookmarksContainerClassName}>
                {config.bookmarks.map((bookmark, index) => (
                    <a
                        key={index}
                        href={bookmark.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 no-underline"
                    >
                        <img
                            src={bookmark.logo || `${bookmark.url}/favicon.ico`}
                            alt={bookmark.text}
                            className="w-6 h-6"
                        />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
              {bookmark.text}
            </span>
                    </a>
                ))}
            </div>
        </WidgetBase>
    );
};

export default WidgetBookmark;

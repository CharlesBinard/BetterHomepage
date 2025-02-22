"use client";

import React from "react";
import WidgetBase, {defaultBaseData, WidgetDataBase} from "@/components/widgets/base/widget-base";
import { CommonWidgetProps, WidgetType } from "@/components/widgets/widget-types";
import WidgetBookmarkConfigForm from "@/components/widgets/bookmark/widget-bookmark-config-form";
import useWidgetConfigDialog from "@/hooks/useWidgetConfigDialog";

export interface WidgetBookmarkData extends WidgetDataBase {
    type: WidgetType.BOOKMARK;
    bookmarks: {
        text: string;
        url: string;
        logo?: string;
    }[];
    bookmarksContainerClassName?: string;
}

export interface WidgetBookmarkProps extends CommonWidgetProps {
    data: WidgetBookmarkData;
}

export const defaultBookmarkData: WidgetBookmarkData= {
    ...defaultBaseData,
    type: WidgetType.BOOKMARK,
    size: {
        width: 200,
        height: 70,
    },
    bookmarks: [
        {
            text: "google",
            url: 'https://www.google.com'
        }
    ]
};


const WidgetBookmark: React.FC<WidgetBookmarkProps> = ({
                                                           data,
                                                           onUpdateData,
                                                           ...rest
                                                       }) => {
    const { WidgetConfigDialog, closeDialog } = useWidgetConfigDialog();


    return (
        <WidgetBase data={data} {...rest}>
            <WidgetConfigDialog type={WidgetType.BOOKMARK}>
                <WidgetBookmarkConfigForm
                    data={data}
                    onSubmit={(newData) => {
                        onUpdateData(data.id, newData);
                        closeDialog();
                    }}
                />
            </WidgetConfigDialog>

            <div className={data.bookmarksContainerClassName || "flex flex-col gap-2"}>
                {data.bookmarks.map((bookmark, index) => (
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

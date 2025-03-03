"use client";

import WidgetBase, {
  defaultBaseData,
  WidgetDataBase,
} from "@/components/widgets/base/widget-base";
import WidgetBookmarkConfigForm from "@/components/widgets/bookmark/widget-bookmark-config-form";
import {
  CommonWidgetProps,
  WidgetType,
} from "@/components/widgets/widget-types";
import useWidgetConfigDialog from "@/hooks/use-widget-config-dialog";
import { cn } from "@/lib/utils";
import React from "react";

export type BookmarkDisplayStyle = "list" | "grid" | "compact";
export type BookmarkHoverEffect = "none" | "scale" | "glow" | "underline";
export type BookmarkIconPosition = "left" | "top";

export interface BookmarkItem {
  text: string;
  url: string;
  logo?: string;
  customColor?: string;
  description?: string;
}

export interface WidgetBookmarkData extends WidgetDataBase {
  type: WidgetType.BOOKMARK;
  bookmarks: BookmarkItem[];
  displayStyle?: BookmarkDisplayStyle;
  hoverEffect?: BookmarkHoverEffect;
  iconPosition?: BookmarkIconPosition;
  iconSize?: number;
  showLabels?: boolean;
  bookmarksContainerClassName?: string;
  itemClassName?: string;
  showFavicon?: boolean;
  useCustomFallbackIcon?: boolean;
  fallbackIconUrl?: string;
  borderRadius?: string;
}

export interface WidgetBookmarkProps extends CommonWidgetProps {
  data: WidgetBookmarkData;
}

export const defaultBookmarkData: WidgetBookmarkData = {
  ...defaultBaseData,
  type: WidgetType.BOOKMARK,
  size: {
    width: 25,
    height: 20,
  },
  bookmarks: [
    {
      text: "Google",
      url: "https://www.google.com",
      description: "Search engine",
    },
  ],
  displayStyle: "list",
  hoverEffect: "scale",
  iconPosition: "left",
  iconSize: 24,
  showLabels: true,
  showFavicon: true,
  useCustomFallbackIcon: false,
  borderRadius: "rounded-md",
};

// Helper to generate the favicon URL with Google's favicon service as backup
const getFaviconUrl = (url: string, fallbackIconUrl?: string) => {
  try {
    // Parse the URL to get the domain
    const domain = new URL(url).hostname;
    // Use Google's favicon service which handles CORS properly
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    // If URL parsing fails, return the fallback
    return (
      fallbackIconUrl ||
      "https://www.google.com/s2/favicons?domain=google.com&sz=64"
    );
  }
};

const WidgetBookmark: React.FC<WidgetBookmarkProps> = ({
  data,
  onUpdateData,
  ...rest
}) => {
  const { WidgetConfigDialog, closeConfigDialog, openConfigDialog } =
    useWidgetConfigDialog();

  // Set defaults for missing properties
  const displayStyle = data.displayStyle || "list";
  const hoverEffect = data.hoverEffect || "none";
  const iconPosition = data.iconPosition || "left";
  const iconSize = data.iconSize || 24;
  const showLabels = data.showLabels !== false;
  const showFavicon = data.showFavicon !== false;
  const borderRadius = data.borderRadius || "rounded-md";

  // Container class based on display style
  const containerClass =
    data.bookmarksContainerClassName ||
    (displayStyle === "grid"
      ? "grid grid-cols-2 sm:grid-cols-3 gap-2"
      : displayStyle === "compact"
      ? "flex flex-wrap gap-2"
      : "flex flex-col gap-2");

  // Item hover effect
  const getHoverClass = () => {
    switch (hoverEffect) {
      case "scale":
        return "transition-transform hover:scale-105";
      case "glow":
        return "transition-shadow hover:shadow-md hover:shadow-primary/25";
      case "underline":
        return "hover:underline";
      default:
        return "";
    }
  };

  // Get item class based on display style and icon position
  const getItemClass = () => {
    const base = `${borderRadius} p-2 flex items-center no-underline ${getHoverClass()}`;

    if (displayStyle === "grid") {
      return iconPosition === "top"
        ? `${base} flex-col justify-center text-center h-24`
        : `${base} gap-2 h-16`;
    }

    if (displayStyle === "compact") {
      return `${base} justify-center bg-background/60 backdrop-blur-sm px-3 h-10`;
    }

    return `${base} gap-2 bg-background/60 backdrop-blur-sm`;
  };

  return (
    <WidgetBase data={data} {...rest} openConfigDialog={openConfigDialog}>
      <WidgetConfigDialog type={WidgetType.BOOKMARK}>
        <WidgetBookmarkConfigForm
          data={data}
          onSubmit={(newData) => {
            onUpdateData(data.id, newData);
            closeConfigDialog();
          }}
        />
      </WidgetConfigDialog>

      <div className={containerClass}>
        {data.bookmarks.map((bookmark, index) => (
          <a
            key={index}
            href={bookmark.url}
            target="_blank"
            rel="noreferrer"
            className={cn(getItemClass(), data.itemClassName)}
            style={{
              color: bookmark.customColor || "inherit",
              display: "flex",
              gap: "10px",
            }}
          >
            {showFavicon && (
              <img
                src={
                  bookmark.logo ||
                  (data.useCustomFallbackIcon
                    ? data.fallbackIconUrl
                    : getFaviconUrl(bookmark.url, data.fallbackIconUrl))
                }
                alt={bookmark.text}
                className={`${iconPosition === "top" ? "mb-1" : ""}`}
                style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
                onError={(e) => {
                  // If the image fails to load, use the fallback or a default icon
                  if (data.fallbackIconUrl) {
                    e.currentTarget.src = data.fallbackIconUrl;
                  } else {
                    // Generic global default
                    e.currentTarget.src =
                      "https://cdn-icons-png.flaticon.com/512/9166/9166568.png";
                  }
                }}
              />
            )}
            {showLabels && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {bookmark.text}
                </span>
                {bookmark.description && displayStyle !== "compact" && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {bookmark.description}
                  </span>
                )}
              </div>
            )}
          </a>
        ))}
      </div>
    </WidgetBase>
  );
};

export default WidgetBookmark;

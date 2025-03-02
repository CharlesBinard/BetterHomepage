"use client";

import WidgetBase, {
  defaultBaseData,
  WidgetDataBase,
} from "@/components/widgets/base/widget-base";
// Import at the top level but handle possible errors
import {
  CommonWidgetProps,
  WidgetType,
} from "@/components/widgets/widget-types";
import useWidgetConfigDialog from "@/hooks/useWidgetConfigDialog";
import { cn } from "@/lib/utils";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

// Dynamic import for the config form
import WidgetDatetimeConfigForm from "./widget-datetime-config-form";

export type DateTimeFormat = "12h" | "24h";
export type DateFormat = "short" | "medium" | "long" | "full" | "custom";
export type DisplayOptions = "dateOnly" | "timeOnly" | "both";

export interface WidgetDatetimeData extends WidgetDataBase {
  type: WidgetType.DATETIME;
  timeFormat?: DateTimeFormat;
  dateFormat?: DateFormat;
  customDateFormat?: string;
  display?: DisplayOptions;
  showSeconds?: boolean;
  showDayOfWeek?: boolean;
  textAlign?: "left" | "center" | "right";
  timeClassName?: string;
  dateClassName?: string;
  containerClassName?: string;
  useCustomFont?: boolean;
  fontFamily?: string;
}

export interface WidgetDatetimeProps extends CommonWidgetProps {
  data: WidgetDatetimeData;
}

export const defaultDatetimeData: WidgetDatetimeData = {
  ...defaultBaseData,
  type: WidgetType.DATETIME,
  size: {
    width: 280,
    height: 140,
  },
  timeFormat: "24h",
  dateFormat: "medium",
  customDateFormat: "yyyy-MM-dd",
  display: "both",
  showSeconds: true,
  showDayOfWeek: true,
  textAlign: "center",
  className: "w-full h-full",
  containerClassName: "flex flex-col justify-center items-center h-full",
  timeClassName: "text-6xl font-bold",
  dateClassName: "text-xl mt-2",
  useCustomFont: false,
  fontFamily: "",
};

const formatDate = (
  date: Date,
  format: DateFormat,
  customFormat?: string
): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (format === "short") {
    options.weekday = undefined;
    options.month = "numeric";
  } else if (format === "medium") {
    options.weekday = undefined;
  } else if (format === "custom" && customFormat) {
    // This is a simple custom format implementation
    // For a more robust solution, consider using libraries like date-fns
    return customFormat
      .replace("yyyy", date.getFullYear().toString())
      .replace("MM", (date.getMonth() + 1).toString().padStart(2, "0"))
      .replace("dd", date.getDate().toString().padStart(2, "0"));
  }

  return date.toLocaleDateString(undefined, options);
};

const formatTime = (
  date: Date,
  format: DateTimeFormat,
  showSeconds: boolean
): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
    hour12: format === "12h",
  };

  return date.toLocaleTimeString(undefined, options);
};

// Memoize the config form to prevent unnecessary re-renders
const MemoizedConfigForm = memo(
  ({
    data,
    onUpdateData,
    closeDialog,
  }: {
    data: WidgetDatetimeData;
    onUpdateData: (id: string, newData: WidgetDatetimeData) => void;
    closeDialog: () => void;
  }) => (
    <WidgetDatetimeConfigForm
      data={data}
      onSubmit={(newData: WidgetDatetimeData) => {
        onUpdateData(data.id, newData);
        closeDialog();
      }}
    />
  )
);
MemoizedConfigForm.displayName = "MemoizedConfigForm";

// Memoize the display component to prevent unnecessary re-renders
const DateTimeDisplay = memo(
  ({
    currentDateTime,
    data,
  }: {
    currentDateTime: Date;
    data: WidgetDatetimeData;
  }) => {
    // Prepare display values
    const timeFormat = data.timeFormat || "24h";
    const dateFormat = data.dateFormat || "medium";
    const showSeconds = data.showSeconds !== false;
    const showDayOfWeek = data.showDayOfWeek !== false;
    const textAlign = data.textAlign || "center";
    const display = data.display || "both";

    const timeString = formatTime(currentDateTime, timeFormat, showSeconds);
    const dateString = formatDate(
      currentDateTime,
      dateFormat,
      data.customDateFormat
    );
    const dayOfWeek = showDayOfWeek
      ? currentDateTime.toLocaleDateString(undefined, { weekday: "long" })
      : "";

    const containerStyle: React.CSSProperties = {
      textAlign: textAlign,
      fontFamily:
        data.useCustomFont && data.fontFamily ? data.fontFamily : "inherit",
    };

    return (
      <div
        className={cn(
          "flex flex-col justify-center items-center h-full",
          data.containerClassName
        )}
        style={containerStyle}
      >
        {(display === "timeOnly" || display === "both") && (
          <div className={data.timeClassName}>{timeString}</div>
        )}

        {(display === "dateOnly" || display === "both") && (
          <div className={data.dateClassName}>
            {showDayOfWeek && <div className="font-medium">{dayOfWeek}</div>}
            <div>{dateString}</div>
          </div>
        )}
      </div>
    );
  }
);
DateTimeDisplay.displayName = "DateTimeDisplay";

const WidgetDatetime: React.FC<WidgetDatetimeProps> = ({
  data,
  onUpdateData,
  ...rest
}) => {
  const { WidgetConfigDialog, closeDialog, isOpen } = useWidgetConfigDialog();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize the data to prevent unnecessary re-renders
  const safeData = useCallback(() => {
    return data || { ...defaultDatetimeData };
  }, [data]);

  // Update the time only when the dialog is not open to prevent modal flicker
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Only set up timer if config dialog is closed
    if (!isOpen) {
      timerRef.current = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen]);

  return (
    <WidgetBase data={data} {...rest}>
      {/* Configuration Dialog */}
      <WidgetConfigDialog type={WidgetType.DATETIME}>
        <MemoizedConfigForm
          data={safeData()}
          onUpdateData={onUpdateData}
          closeDialog={closeDialog}
        />
      </WidgetConfigDialog>

      {/* Date/Time Content */}
      <DateTimeDisplay currentDateTime={currentDateTime} data={safeData()} />
    </WidgetBase>
  );
};

export default WidgetDatetime;

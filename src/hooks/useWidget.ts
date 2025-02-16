"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {DragEndEvent} from "@dnd-kit/core";
import {BoxPosition, BoxSize} from "@/components/draggable-resizable-box";
import {WidgetConfig, WidgetData, WidgetType} from "@/components/widgets/widget-types";


const LOCAL_STORAGE_KEY = "myDraggableWidgets";

const useWidget = () => {
    const [widgetsData, setWidgetsData] = useState<WidgetData[]>([]);
    const saveTimeout = useRef<number | null>(null);
    const nextWidgetId = useRef(0);

    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                const parsedWidgets = JSON.parse(saved) as WidgetData[];
                setWidgetsData(parsedWidgets);
                nextWidgetId.current = parsedWidgets.reduce((max, widget) => {
                    const idNumber = parseInt(widget.id.split("-")[1], 10) || 0;
                    return Math.max(max, idNumber);
                }, 0);
            } catch (error) {
                console.error("Erreur lors du parsing du localStorage :", error);
            }
        }
    }, []);

    const saveWidgets = useCallback((newWidgets: WidgetData[]) => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = window.setTimeout(() => {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newWidgets));
        }, 300);
    }, []);

    useEffect(() => {
        saveWidgets(widgetsData);
    }, [widgetsData, saveWidgets]);

    const addWidget = useCallback((type: WidgetType) => {
        nextWidgetId.current += 1;
        const newWidgetId = `widget-${nextWidgetId.current}`;

        const newWidget: WidgetData = {
            id: newWidgetId,
            position: { x: 50, y: 50 },
            size: { width: 150, height: 150 },
            type
        };

        setWidgetsData((prev) => [...prev, newWidget]);
    }, []);

    const updateWidgetPosition = useCallback(
        (id: string, pos: BoxPosition) => {
            setWidgetsData((prev) =>
                prev.map((w) => (w.id === id ? { ...w, position: pos } : w))
            );
        },
        []
    );

    const updateWidgetSize = useCallback(
        (id: string, size: BoxSize) => {
            setWidgetsData((prev) =>
                prev.map((w) => (w.id === id ? { ...w, size } : w))
            );
        },
        []
    );

    const updateWidgetConfig = useCallback(
        (id: string, newConfig: WidgetConfig) => {
            setWidgetsData((prev) =>
                prev.map((w) => (w.id === id ? { ...w, config: newConfig } : w))
            );
        },
        []
    );

    const deleteWidget = useCallback((id: string) => {
        setWidgetsData((prev) => prev.filter((w) => w.id !== id));
    }, []);

    const getWidgetById = useCallback(
        (id: string) => widgetsData.find((w) => w.id === id) || null,
        [widgetsData]
    );

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const widgetId = event.active.id as string;
        setWidgetsData((prev) =>
            prev.map((w) =>
                w.id === widgetId
                    ? {
                        ...w,
                        position: {
                            x: w.position.x + event.delta.x,
                            y: w.position.y + event.delta.y,
                        },
                    }
                    : w
            )
        );
    }, []);

    return {
        widgetsData,
        addWidget,
        updateWidgetPosition,
        updateWidgetSize,
        updateWidgetConfig,
        deleteWidget,
        handleDragEnd,
        getWidgetById,
    };
};

export default useWidget;

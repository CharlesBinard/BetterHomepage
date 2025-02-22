"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {BoxPosition, BoxSize} from "@/components/draggable-resizable-box";
import {DEFAULT_WIDGET_CONFIGS} from "@/components/widgets/widget-constants";
import {WidgetData, WidgetType} from "@/components/widgets/widget-types";

const LOCAL_STORAGE_KEY = "widgets-data-dashboard";

const fetchWidgetsData = async (): Promise<WidgetData[]> => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (error) {
            console.error("Error parsing localStorage:", error);
            return [];
        }
    }
    return [];
};

const useWidget = () => {
    const queryClient = useQueryClient();
    const saveTimeout = useRef<number | null>(null);
    const nextWidgetId = useRef(0);
    const [localWidgetsData, setLocalWidgetsData] = useState<WidgetData[]>([]);

    const { data: initialWidgetsData = [] } = useQuery({
        queryKey: [LOCAL_STORAGE_KEY],
        queryFn: async () => fetchWidgetsData(),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setLocalWidgetsData(initialWidgetsData);
    }, [initialWidgetsData]);

    useEffect(() => {
        if (localWidgetsData.length > 0) {
            nextWidgetId.current = localWidgetsData.reduce((max, widget) => {
                const idNumber = parseInt(widget.id.split("-")[1], 10) || 0;
                return Math.max(max, idNumber);
            }, 0);
        }
    }, [localWidgetsData]);

    useEffect(() => {
        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }
        saveTimeout.current = window.setTimeout(() => {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localWidgetsData));
        }, 300);
    }, [localWidgetsData]);

    const addWidget = useCallback(
        (type: WidgetType) => {
            nextWidgetId.current += 1;
            const newWidgetId = `widget-${nextWidgetId.current}`;

            const newWidgetData: WidgetData = {
                ...DEFAULT_WIDGET_CONFIGS[type].defaultData,
                id: newWidgetId,
            };

            setLocalWidgetsData((oldData) =>
                oldData ? [...oldData, newWidgetData] : [newWidgetData]
            );
        },
        []
    );

    const updateWidgetPosition = useCallback(
        (id: string, pos: BoxPosition) => {
            updateWidget(id, (widget) => ({ ...widget, position: pos }));
        },
        []
    );

    const updateWidgetSize = useCallback(
        (id: string, size: BoxSize) => {
            updateWidget(id, (widget) => ({ ...widget, size }));
        },
        []
    );

    const updateWidgetData = useCallback(
        (id: string, newData: WidgetData) => {
            updateWidget(id, () => newData);
        },
        []
    );

    const updateWidget = (id: string, updater: (widget: WidgetData) => WidgetData) => {
        setLocalWidgetsData((oldData) =>
            oldData.map((widget) => (widget.id === id ? updater(widget) : widget))
        );
    };


    const deleteWidget = useCallback(
        (id: string) => {
            setLocalWidgetsData((oldData) => {
                if (!oldData) return [];
                return oldData.filter((w) => w.id !== id);
            });
        },
        []
    );

    const getWidgetById = useCallback(
        (id: string) => localWidgetsData.find((w) => w.id === id) || null,
        [localWidgetsData]
    );


    useEffect(() => {
        queryClient.setQueryData<WidgetData[]>([LOCAL_STORAGE_KEY], localWidgetsData);
    }, [localWidgetsData, queryClient]);

    return {
        widgetsData: localWidgetsData,
        getWidgetById,
        addWidget,
        deleteWidget,
        updateWidgetSize,
        updateWidgetPosition,
        updateWidgetData,
    };
};

export default useWidget;

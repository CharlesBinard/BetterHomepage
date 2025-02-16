"use client";

import {DndContext} from "@dnd-kit/core";
import React from "react";

import ThemeSwitcher from "@/components/theme-switcher";
import Widget from "@/components/widgets/widget"
import useWidget from "@/hooks/useWidget";
import {WidgetType} from "@/components/widgets/widget-types";
import {restrictToWindowEdges} from "@dnd-kit/modifiers";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

const Home: React.FC = () => {
    const {
        widgetsData,
        addWidget,
        updateWidgetPosition,
        updateWidgetSize,
        updateWidgetConfig,
        deleteWidget,
        handleDragEnd,
    } = useWidget();

    return (
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>

            <div className="h-screen w-screen relative bg-gray-50 dark:bg-gray-900 p-6">
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => addWidget(WidgetType.WEATHER)}
                        className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none transition-colors shadow-md"
                    >
                        Add Weather
                    </button>
                    <button
                        onClick={() => addWidget(WidgetType.BOOKMARK)}
                        className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none transition-colors shadow-md"
                    >
                        Add Bookmark
                    </button>
                    <button
                        onClick={() => addWidget(WidgetType.IFRAME)}
                        className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors shadow-md"
                    >
                        Add Iframe
                    </button>
                </div>
                {widgetsData.map((data) => (
                    <Widget
                        key={data.id}
                        data={data}
                        onUpdatePosition={updateWidgetPosition}
                        onUpdateSize={updateWidgetSize}
                        onUpdateConfig={updateWidgetConfig}
                        onDelete={deleteWidget}
                    />
                ))}
            </div>
            <div className="fixed bottom-4 right-4 z-50">
            <Popover>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent>
                    <div>
                        <ThemeSwitcher />
                    </div>
                </PopoverContent>
            </Popover>
            </div>
        </DndContext>
    );
};

export default Home;

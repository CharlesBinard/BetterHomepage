"use client";

import {DndContext} from "@dnd-kit/core";
import React from "react";

import Widget from "@/components/widgets/widget"
import useWidget from "@/hooks/useWidget";
import {restrictToWindowEdges} from "@dnd-kit/modifiers";
import useTheme from "@/hooks/useTheme";
import AddWidgetDrawer from "@/components/add-widget-drawer";

const Home: React.FC = () => {
    const {
        widgetsData,
        updateWidgetSize,
        updateWidgetData,
        deleteWidget,
        updateWidgetPosition,
        getWidgetById,
    } = useWidget();

    useTheme();

    return (
        <DndContext
            onDragEnd={(event) => {
                const id = event.active.id as string;
                const widget = getWidgetById(id);
                if (!widget) return;

                const newPos = {
                    x: widget.position.x + event.delta.x,
                    y: widget.position.y + event.delta.y,
                };

                updateWidgetPosition(id, newPos);

            }}
            modifiers={[restrictToWindowEdges]}>

            <div className="h-screen w-screen relative bg-gray-50 dark:bg-gray-900 p-6">
                {widgetsData.map((data) => (
                    <Widget
                        key={data.id}
                        data={data}
                        onUpdateSize={updateWidgetSize}
                        onUpdateData={updateWidgetData}
                        onDelete={deleteWidget}
                    />
                ))}
            </div>
            <div className="fixed top-5 right-5 z-50">
                <AddWidgetDrawer/>
            </div>
        </DndContext>
    );
};

export default Home;

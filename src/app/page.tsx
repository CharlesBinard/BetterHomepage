"use client";

import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React from "react";

import AddWidgetDrawer from "@/components/add-widget-drawer";
import EditModeToggle from "@/components/edit-mode-toggle";
import Widget from "@/components/widgets/widget";
import useEditMode from "@/hooks/useEditMode";
import useTheme from "@/hooks/useTheme";
import useWidget from "@/hooks/useWidget";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

const Home: React.FC = () => {
  const {
    widgetsData,
    updateWidgetSize,
    updateWidgetData,
    deleteWidget,
    updateWidgetPosition,
    getWidgetById,
  } = useWidget();
  const { editMode } = useEditMode();

  useTheme();

  // Configure the sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Lower the activationConstraint threshold for better mobile experience
      activationConstraint: {
        delay: 0,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      // Lower activation constraint for touch
      activationConstraint: {
        delay: 50,
        tolerance: 5,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={(event) => {
        // Only allow moving widgets in edit mode
        if (!editMode) return;

        const id = event.active.id as string;
        const widget = getWidgetById(id);
        if (!widget) return;

        const newPos = {
          x: widget.position.x + event.delta.x,
          y: widget.position.y + event.delta.y,
        };

        updateWidgetPosition(id, newPos);
      }}
      modifiers={[restrictToWindowEdges]}
    >
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
      <div className="fixed top-5 right-5 z-50 flex space-x-2">
        <EditModeToggle />
        <AddWidgetDrawer />
      </div>
    </DndContext>
  );
};

export default Home;

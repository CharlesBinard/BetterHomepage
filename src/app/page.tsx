"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React from "react";

import AddWidgetDrawer from "@/components/layout/add-widget-drawer";
import BackgroundImage from "@/components/layout/background-image";
import EditModeToggle from "@/components/settings/edit-mode-toggle";
import ThemeSwitcher from "@/components/settings/theme-switcher";
import Widget from "@/components/widgets/widget";
import useEditMode from "@/hooks/use-edit-mode";
import useTheme from "@/hooks/use-theme";
import useWidget from "@/hooks/use-widget";
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

  // Handle drag end with proper percentage-based positioning
  const handleDragEnd = (event: DragEndEvent) => {
    // Only allow moving widgets in edit mode
    if (!editMode) return;

    const { active, delta } = event;

    if (active) {
      const id = active.id as string;
      const widget = getWidgetById(id);

      if (widget) {
        // Calculate absolute new position (original percentage-based pos + delta in pixels)
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Convert current percentage positions to pixels for accurate calculation
        const currentXPx = (widget.position.x / 100) * viewportWidth;
        const currentYPx = (widget.position.y / 100) * viewportHeight;

        // Add the delta (in pixels) from the drag operation
        const newXPx = currentXPx + delta.x;
        const newYPx = currentYPx + delta.y;

        // Convert back to percentages
        let newX = (newXPx / viewportWidth) * 100;
        let newY = (newYPx / viewportHeight) * 100;

        // Constrain to viewport (allow some overflow for usability)
        newX = Math.max(0, Math.min(newX, 95));
        newY = Math.max(0, Math.min(newY, 95));

        const newPos = {
          x: newX,
          y: newY,
        };

        updateWidgetPosition(id, newPos);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      {/* Background Image  */}
      <BackgroundImage />

      <div className="h-screen w-screen relative p-3 sm:p-4 md:p-6 pt-14 overflow-hidden">
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
      <div className="fixed top-3 sm:top-5 right-3 sm:right-5 z-50 flex space-x-2">
        <ThemeSwitcher />
        <EditModeToggle />
        <AddWidgetDrawer />
      </div>
    </DndContext>
  );
};

export default Home;

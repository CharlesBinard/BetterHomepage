import { Button } from "@/components/ui/button";
import useEditMode from "@/hooks/useEditMode";
import { useDraggable } from "@dnd-kit/core";
import { CircleX, GripVertical, Scaling } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export interface BoxPosition {
  x: number;
  y: number;
}

export interface BoxSize {
  height: number;
  width: number;
}

export interface DraggableResizableBoxProps {
  id: string;
  position: BoxPosition;
  size: BoxSize;
  onUpdateSize: (newSize: BoxSize) => void;
  onDelete: () => void;
  children: React.ReactNode;
  zIndex?: number;
  className?: string;
}

const MIN_WIDTH = 100;
const MIN_HEIGHT = 60;

const DraggableResizableBox: React.FC<DraggableResizableBoxProps> = ({
  id,
  position,
  size,
  onUpdateSize,
  onDelete,
  children,
  zIndex = 0,
  className = "",
}) => {
  const { editMode } = useEditMode();
  const [isResizing, setIsResizing] = useState(false);
  const [localSize, setLocalSize] = useState(size);

  // Use default configuration - dnd-kit supports touch by default
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const computedTransform = useMemo(
    () =>
      transform && !isResizing
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : "",
    [transform, isResizing]
  );

  const boxStyle: React.CSSProperties = useMemo(
    () => ({
      position: "absolute",
      top: position.y,
      left: position.x,
      width: localSize.width,
      height: localSize.height,
      transform: computedTransform,
      zIndex,
      transition: "none",
      touchAction: isResizing ? "none" : "manipulation", // Improve touch handling
    }),
    [position, localSize, computedTransform, zIndex, isResizing]
  );

  // Debounced version of onUpdateSize
  const debouncedUpdateSize = useDebouncedCallback((newSize: BoxSize) => {
    onUpdateSize(newSize);
  }, 200);

  // Prevent document scrolling when resizing
  useEffect(() => {
    if (isResizing) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isResizing]);

  const handleResizeStart = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      e.stopPropagation();
      setIsResizing(true);

      // Get starting coordinates for both mouse and touch events
      const startX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const startY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const startWidth = localSize.width;
      const startHeight = localSize.height;

      // Handler for mouse move and touch move
      const onMove = (moveEvent: MouseEvent | TouchEvent) => {
        const clientX =
          "touches" in moveEvent
            ? moveEvent.touches[0].clientX
            : (moveEvent as MouseEvent).clientX;

        const clientY =
          "touches" in moveEvent
            ? moveEvent.touches[0].clientY
            : (moveEvent as MouseEvent).clientY;

        const newWidth = Math.max(startWidth + (clientX - startX), MIN_WIDTH);
        const newHeight = Math.max(
          startHeight + (clientY - startY),
          MIN_HEIGHT
        );

        const newSize = { width: newWidth, height: newHeight };
        setLocalSize(newSize);
        debouncedUpdateSize(newSize);

        // Prevent default to avoid scrolling while resizing on touch devices
        if ("touches" in moveEvent) {
          moveEvent.preventDefault();
        }
      };

      // Handler for mouse up and touch end
      const onEnd = () => {
        setIsResizing(false);
        debouncedUpdateSize.flush();

        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("mouseup", onEnd);
        document.removeEventListener("touchend", onEnd);
      };

      // Add both mouse and touch event listeners
      document.addEventListener("mousemove", onMove, { passive: false });
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchend", onEnd);
    },
    [localSize, debouncedUpdateSize]
  );

  return (
    <div
      ref={setNodeRef}
      style={boxStyle}
      className={`
        group select-none transition-all
        ${
          editMode
            ? "ring-2 ring-blue-500/60 dark:ring-blue-500/60 shadow-md rounded-lg"
            : ""
        }
      `}
      {...attributes}
    >
      {/* Edit mode indicator overlay */}
      {editMode && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none rounded-lg"></div>
      )}

      {/* Widget content */}
      <div
        className={`${className} relative h-full rounded-lg overflow-hidden`}
      >
        {children}
      </div>

      {editMode && (
        <>
          {/* Controls toolbar */}
          <div className="absolute top-1 right-1 z-10 flex space-x-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md p-1 shadow-md">
            <Button
              variant="ghost"
              className="cursor-grab touch-manipulation h-8 w-8 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900"
              size="icon"
              {...listeners}
              {...attributes}
              aria-label="Move"
              style={{ touchAction: "none" }}
            >
              <GripVertical className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="touch-manipulation h-8 w-8 rounded-md hover:bg-red-100 dark:hover:bg-red-900"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              aria-label="Delete"
            >
              <CircleX className="h-4 w-4 text-red-500 dark:text-red-400" />
            </Button>
          </div>

          {/* Resize handle */}
          <div
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
            className="absolute right-1 bottom-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md rounded-md p-1.5 cursor-se-resize touch-manipulation hover:bg-blue-100 dark:hover:bg-blue-900"
            aria-label="Resize"
          >
            <Scaling className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </div>

          {/* Small edit mode indicator badge */}
          <div className="absolute bottom-1 left-1 bg-blue-500/80 text-white text-xs px-1.5 py-0.5 rounded-md backdrop-blur-sm shadow-sm">
            Edit mode
          </div>
        </>
      )}
    </div>
  );
};

export default DraggableResizableBox;

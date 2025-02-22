import { useDraggable } from "@dnd-kit/core";
import { CircleX, GripVertical, Scaling } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "use-debounce"; // Import useDebouncedCallback

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
    const [isResizing, setIsResizing] = useState(false);
    const [localSize, setLocalSize] = useState(size);

    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

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
        }),
        [position, localSize, computedTransform, zIndex]
    );

    // Debounced version of onUpdateSize
    const debouncedUpdateSize = useDebouncedCallback(
        (newSize: BoxSize) => {
            onUpdateSize(newSize);
        },
        200
    );

    const handleResizeStart = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            setIsResizing(true);

            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = localSize.width;
            const startHeight = localSize.height;

            const onMouseMove = (moveEvent: MouseEvent) => {
                const newWidth = Math.max(
                    startWidth + (moveEvent.clientX - startX),
                    MIN_WIDTH
                );
                const newHeight = Math.max(
                    startHeight + (moveEvent.clientY - startY),
                    MIN_HEIGHT
                );

                const newSize = { width: newWidth, height: newHeight };
                setLocalSize(newSize);
                debouncedUpdateSize(newSize);
            };

            const onMouseUp = () => {
                setIsResizing(false);
                debouncedUpdateSize.flush();

                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        },
        [localSize, debouncedUpdateSize]
    );

    return (
        <div
            ref={setNodeRef}
            style={boxStyle}
            className={`group select-none transition-all`}
            {...attributes}
        >
            <div className={`${className}`}>{children}</div>

            <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    className="cursor-grab"
                    size="icon"
                    {...listeners}
                >
                    <GripVertical />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    <CircleX />
                </Button>
            </div>

            <div
                onMouseDown={handleResizeStart}
                className="absolute right-1 bottom-1 m-1 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
            >
                <Scaling size={15} />
            </div>
        </div>
    );
};

export default DraggableResizableBox;

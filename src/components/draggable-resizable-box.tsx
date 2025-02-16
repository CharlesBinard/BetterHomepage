import {useDraggable} from "@dnd-kit/core";
import {CircleX, GripVertical, Scaling} from "lucide-react";
import React, {useCallback, useMemo, useRef, useState} from "react";
import {Button} from "@/components/ui/button";

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
    onUpdatePosition: (newPosition: BoxPosition) => void;
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
                                                                         onUpdatePosition,
                                                                         size,
                                                                         onUpdateSize,
                                                                         onDelete,
                                                                         children,
                                                                         zIndex,
    className
                                                                     }) => {
    const [isResizing, setIsResizing] = useState(false);
    const offsetRef = useRef<{ x: number; y: number }>({x: 0, y: 0});

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id,
    });

    const computedTransform = useMemo(() => {
        return transform && !isResizing
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : "";
    }, [transform, isResizing]);

    const boxStyle: React.CSSProperties = useMemo(
        () => ({
            position: "absolute",
            top: position.y,
            left: position.x,
            width: size.width,
            height: size.height,
            transform: computedTransform,
            zIndex: zIndex || 0,
            transition: "none",
        }),
        [position, size, computedTransform]
    );

    const handleResizeStart = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            setIsResizing(true);
            offsetRef.current = transform
                ? {x: transform.x, y: transform.y}
                : {x: 0, y: 0};

            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = size.width;
            const startHeight = size.height;

            const onMouseMove = (moveEvent: MouseEvent) => {
                const newWidth = startWidth + (moveEvent.clientX - startX);
                const newHeight = startHeight + (moveEvent.clientY - startY);
                onUpdateSize({
                    width: Math.max(newWidth, MIN_WIDTH),
                    height: Math.max(newHeight, MIN_HEIGHT),
                });
            };

            const onMouseUp = () => {
                onUpdatePosition({
                    x: position.x + offsetRef.current.x,
                    y: position.y + offsetRef.current.y,
                });
                setIsResizing(false);
                offsetRef.current = {x: 0, y: 0};

                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        },
        [transform, size.width, size.height, onUpdateSize, onUpdatePosition, position.x, position.y]
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
                    <CircleX/>
                </Button>
            </div>
            <div
                onMouseDown={handleResizeStart}
                className="absolute right-1 bottom-1 m-1 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
            >
                <Scaling size={15}/>
            </div>
        </div>
    );
};

export default DraggableResizableBox;

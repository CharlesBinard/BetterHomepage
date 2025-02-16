// widget-base.tsx
import React, { useCallback } from "react";
import DraggableResizableBox, { BoxPosition, BoxSize } from "@/components/draggable-resizable-box";
import {WidgetProps} from "@/components/widgets/widget";

export interface WidgetBaseConfig {
    className?: string;
    zIndex?: number;
}

export interface WidgetBaseProps
    extends Omit<WidgetProps, "onUpdateConfig"> {
    children: React.ReactNode;
}

export const defaultBaseConfig: WidgetBaseConfig = {
    "className": "flex flex-col  justify-center items-center h-full w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm",
    zIndex: 1,
};

const WidgetBase = ({
                        children,
                        data,
                        onUpdatePosition,
                        onUpdateSize,
                        onDelete,
                    }: WidgetBaseProps) => {
    const handleUpdatePosition = useCallback(
        (newPos: BoxPosition) => {
            onUpdatePosition(data.id, newPos);
        },
        [data.id, onUpdatePosition]
    );

    const handleUpdateSize = useCallback(
        (newSize: BoxSize) => {
            onUpdateSize(data.id, newSize);
        },
        [data.id, onUpdateSize]
    );

    const config = {
        ...defaultBaseConfig,
        ...data.config,
    }


    return (
        <DraggableResizableBox
            id={data.id}
            position={data.position}
            size={data.size}
            onUpdatePosition={handleUpdatePosition}
            onUpdateSize={handleUpdateSize}
            onDelete={() => onDelete(data.id)}
            zIndex={config?.zIndex}
            className={`${config?.className}`}
        >
            {children}
        </DraggableResizableBox>
    );
};

export default WidgetBase;

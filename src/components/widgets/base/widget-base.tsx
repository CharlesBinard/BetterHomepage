// widget-base.tsx
import React, { useCallback } from "react";
import DraggableResizableBox, {BoxPosition, BoxSize} from "@/components/draggable-resizable-box";
import {WidgetProps} from "@/components/widgets/widget";

export interface WidgetDataBase {
    id: string;
    size: BoxSize;
    position: BoxPosition;
    className?: string;
    zIndex?: number;
}

export interface WidgetBaseProps
    extends Omit<WidgetProps, "onUpdateData"> {
    children: React.ReactNode;
}

export const defaultBaseData: WidgetDataBase = {
    id: '0',
    size: {
        height: 150,
        width: 150,
    },
    position: {
        x: 50,
        y: 50,
    },
    className: "h-full w-full",
    zIndex: 1,
};

const WidgetBase = ({
                        children,
                        data,
                        onUpdateSize,
                        onDelete,
                    }: WidgetBaseProps) => {

    const mergedData = { ...defaultBaseData, ...data };

    const handleUpdateSize = useCallback(
        (newSize: BoxSize) => {
            onUpdateSize(data.id, newSize);
        },
        [data.id, onUpdateSize]
    );

    return (
        <DraggableResizableBox
            id={mergedData.id}
            position={mergedData.position}
            size={mergedData.size}
            onUpdateSize={handleUpdateSize}
            onDelete={() => onDelete(mergedData.id)}
            zIndex={mergedData?.zIndex}
            className={`${data?.className}`}
        >
            {children}
        </DraggableResizableBox>
    );
};

export default WidgetBase;

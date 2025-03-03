// widget-base.tsx
import { Button } from "@/components/ui/button";
import DraggableResizableBox, {
  BoxPosition,
  BoxSize,
} from "@/components/ui/draggable-resizable-box";
import { WidgetProps } from "@/components/widgets/widget";
import useEditMode from "@/hooks/use-edit-mode";
import { FileUp, Settings } from "lucide-react";
import React, { useCallback } from "react";
import { toast } from "sonner";

export interface WidgetDataBase {
  id: string;
  size: BoxSize;
  position: BoxPosition;
  className?: string;
  zIndex?: number;
}

export interface WidgetBaseProps extends Omit<WidgetProps, "onUpdateData"> {
  children: React.ReactNode;
  openConfigDialog: () => void;
}

export const defaultBaseData: WidgetDataBase = {
  id: "0",
  size: {
    height: 15,
    width: 20,
  },
  position: {
    x: 5,
    y: 5,
  },
  className: "h-full w-full",
  zIndex: 1,
};

const WidgetBase = ({
  children,
  data,
  onUpdateSize,
  onDelete,
  openConfigDialog,
}: WidgetBaseProps) => {
  const mergedData = { ...defaultBaseData, ...data };
  const { editMode } = useEditMode();

  const handleUpdateSize = useCallback(
    (newSize: BoxSize) => {
      onUpdateSize(data.id, newSize);
    },
    [data.id, onUpdateSize]
  );

  const handleExport = useCallback(() => {
    const jsonData = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonData);
    toast.success("Widget data copied to clipboard");
  }, [data]);

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
      {editMode && (
        <div className="absolute top-1 left-1 z-10 flex gap-1 space-x-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md p-1 shadow-md">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-grab touch-manipulation h-8 w-8 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              openConfigDialog();
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-grab touch-manipulation h-8 w-8 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900"
            onClick={handleExport}
          >
            <FileUp className="h-4 w-4" />
          </Button>
        </div>
      )}

      {children}
    </DraggableResizableBox>
  );
};

export default WidgetBase;

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WidgetType } from "@/components/widgets/widget-types";
import useEditMode from "@/hooks/use-edit-mode";
import { Settings } from "lucide-react";
import React, { useCallback, useState } from "react";
export interface WidgetConfigDialogProps {
  type: WidgetType;
  children: React.ReactNode;
}

const useWidgetConfigDialog = () => {
  const { editMode } = useEditMode();
  const [open, setOpen] = useState(false);

  const openConfigDialog = useCallback(() => {
    setOpen(true);
  }, []);

  const closeConfigDialog = useCallback(() => {
    setOpen(false);
  }, []);

  const WidgetConfigDialog: React.FC<WidgetConfigDialogProps> = ({
    type,
    children,
  }) => {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {editMode && (
            <div className="absolute top-1 left-1 z-10 flex space-x-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md p-1 shadow-md">
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
            </div>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px] " style={{ zIndex: 101 }}>
          <DialogHeader>
            <DialogTitle>Edit widget: {type}</DialogTitle>
            <DialogDescription>
              Make changes to your widget here. Click save when you&#39;re done.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] rounded-md grid gap-4 p-4">
            {children}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  };

  // Return open state as well to allow consumers to react to dialog state
  return {
    WidgetConfigDialog,
    openConfigDialog,
    closeConfigDialog,
    isOpen: open,
  };
};

export default useWidgetConfigDialog;

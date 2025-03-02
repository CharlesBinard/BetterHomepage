"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DEFAULT_WIDGET_CONFIGS } from "@/components/widgets/widget-constants";
import { WidgetType } from "@/components/widgets/widget-types";
import useEditMode from "@/hooks/useEditMode";
import useWidget from "@/hooks/useWidget";
import { SquarePlus } from "lucide-react";

const AddWidgetDrawer = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { setEditMode } = useEditMode();
  const { addWidget } = useWidget();

  const handleAddWidget = (type: WidgetType) => {
    addWidget(type);
    setIsOpen(false);
    setEditMode(true);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm"
        >
          <SquarePlus className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-96 max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-3xl font-extrabold text-center text-gradient">
              BetterHomePage
            </DrawerTitle>
            <DrawerDescription className="text-center text-muted-foreground text-md ">
              Choose a widget to add
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex flex-col gap-4">
              {Object.values(DEFAULT_WIDGET_CONFIGS).map((widget) => (
                <div
                  key={widget.type}
                  className="flex items-center gap-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  style={{ borderColor: widget.color }}
                >
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-full"
                    style={{ backgroundColor: widget.color }}
                  >
                    <widget.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{widget.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {widget.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddWidget(widget.type)}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddWidgetDrawer;

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
import useEditMode from "@/hooks/use-edit-mode";
import useWidget from "@/hooks/use-widget";
import { motion } from "framer-motion";
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

  // Animation variants for grid items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-300"
        >
          <SquarePlus className="h-5 w-5 text-primary" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-gradient-to-b from-background/80 to-background backdrop-blur-md border-t border-border/40">
        <div className="mx-auto w-full max-w-5xl">
          <DrawerHeader>
            <DrawerTitle className="text-4xl font-extrabold text-center bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent pb-2">
              Add New Widget
            </DrawerTitle>
            <DrawerDescription className="text-center text-muted-foreground text-lg max-w-lg mx-auto">
              Customize your homepage with these powerful widgets
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-6">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {Object.values(DEFAULT_WIDGET_CONFIGS).map((widget) => (
                <motion.div
                  key={widget.type}
                  variants={item}
                  className="relative group overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 dark:bg-gray-800/20 border border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Background gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${widget.color}40 0%, transparent 100%)`,
                    }}
                  />

                  <div className="flex flex-col h-full p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="flex items-center justify-center w-12 h-12 rounded-lg shadow-md transform group-hover:scale-110 transition-transform duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${
                            widget.color
                          } 0%, ${adjustColor(widget.color, -20)} 100%)`,
                        }}
                      >
                        <widget.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{widget.title}</h3>
                    </div>

                    <p className="text-sm text-muted-foreground mb-5 flex-grow">
                      {widget.description}
                    </p>

                    <Button
                      onClick={() => handleAddWidget(widget.type)}
                      className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-300 z-200"
                      variant="outline"
                      style={{
                        borderColor: widget.color,
                        color: widget.color,
                      }}
                    >
                      <span>Add Widget</span>
                      <SquarePlus className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  // This is a simplified approach - works with hex colors
  if (color.startsWith("#")) {
    color = color.slice(1);
  }

  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.min(Math.max(0, r), 255);
  g = Math.min(Math.max(0, g), 255);
  b = Math.min(Math.max(0, b), 255);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export default AddWidgetDrawer;

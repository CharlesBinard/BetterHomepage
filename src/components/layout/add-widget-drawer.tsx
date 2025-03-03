"use client";

import * as React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_WIDGET_CONFIGS } from "@/components/widgets/widget-constants";
import { WidgetType } from "@/components/widgets/widget-types";
import useEditMode from "@/hooks/use-edit-mode";
import useWidget from "@/hooks/use-widget";
import { motion } from "framer-motion";
import { AlertTriangle, Check, Code, SquarePlus } from "lucide-react";
import { toast } from "sonner";

const AddWidgetDrawer = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { setEditMode } = useEditMode();
  const { addWidget, widgetsData } = useWidget();
  const [jsonInput, setJsonInput] = React.useState("");
  const [jsonError, setJsonError] = React.useState<string | null>(null);
  const widgetsCountRef = React.useRef(0);

  // Update reference count when widgets change
  React.useEffect(() => {
    widgetsCountRef.current = widgetsData.length;
  }, [widgetsData]);

  const handleAddWidget = (type: WidgetType) => {
    addWidget(type);
    setIsOpen(false);
    setEditMode(true);
  };

  const loadExampleJson = () => {
    const example = {
      type: "weather",
      subType: "hourly",
      displayCity: true,
      city: {
        name: "Paris",
        latitude: 48.8566,
        longitude: 2.3522,
        country: "France",
        postcodes: ["75001"],
      },
      className:
        "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl rounded-2xl p-4 w-full h-full text-white",
      position: {
        x: 10,
        y: 10,
      },
      size: {
        width: 20,
        height: 15,
      },
    };

    setJsonInput(JSON.stringify(example, null, 2));
    setJsonError(null);
  };

  const handleJsonImport = () => {
    try {
      if (!jsonInput.trim()) {
        setJsonError("Please enter valid JSON data");
        return;
      }

      const widgetData = JSON.parse(jsonInput);

      // Basic validation
      if (!widgetData.type) {
        setJsonError("JSON must include at least a 'type' field");
        return;
      }

      // Check if the type is valid
      if (!Object.values(WidgetType).includes(widgetData.type)) {
        setJsonError(
          `Invalid widget type: ${
            widgetData.type
          }. Valid types are: ${Object.values(WidgetType).join(", ")}`
        );
        return;
      }

      console.log(widgetData);

      // Add the widget
      addWidget(widgetData.type as WidgetType, widgetData);

      toast.success("Widget imported successfully", {
        description: `Added ${widgetData.type} widget from JSON`,
        icon: <Check className="h-4 w-4" />,
      });

      // Clear form and close drawer
      setJsonInput("");
      setJsonError(null);
      setIsOpen(false);
      setEditMode(true);
    } catch (error) {
      console.error("JSON import error:", error);
      setJsonError(
        `Invalid JSON: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
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
          <ScrollArea className="p-6 h-[calc(100vh-10rem)]">
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

            {/* JSON Import Section */}
            <motion.div
              variants={item}
              initial="hidden"
              animate="show"
              className="mt-10"
            >
              <Card className="backdrop-blur-sm bg-white/10 dark:bg-gray-800/20 border border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 shadow-md">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle>Import Widget from JSON</CardTitle>
                  </div>
                  <CardDescription>
                    Paste a widget configuration JSON to create a custom widget
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {jsonError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{jsonError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="json-input">
                          Widget JSON Configuration
                        </Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={loadExampleJson}
                          className="text-xs"
                        >
                          Load Example
                        </Button>
                      </div>
                      <Textarea
                        id="json-input"
                        placeholder={`{
                          "type": "weather",
                          "city": {
                            "name": "Paris",
                            "latitude": 48.8566,
                            "longitude": 2.3522
                          }
                        }`}
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        className="min-h-32 font-mono text-sm"
                      />
                    </div>
                    <Button
                      onClick={handleJsonImport}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                    >
                      Import Widget
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </ScrollArea>
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

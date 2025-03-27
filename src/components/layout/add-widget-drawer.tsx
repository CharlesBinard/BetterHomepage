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
        "bg-white/90 dark:bg-gray-900/90 shadow-sm rounded-3xl p-4 w-full h-full",
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
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm hover:bg-white/90 dark:hover:bg-gray-900/90 transition-all duration-200"
        >
          <SquarePlus className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl border-t border-gray-200/20 dark:border-gray-800/20">
        <div className="mx-auto w-full max-w-5xl">
          <DrawerHeader>
            <DrawerTitle className="text-3xl font-medium text-center text-gray-900 dark:text-white">
              Add New Widget
            </DrawerTitle>
            <DrawerDescription className="text-center text-gray-500 dark:text-gray-400 text-base max-w-lg mx-auto mt-1">
              Customize your homepage with widgets
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="px-6 pb-8 h-[calc(100vh-8rem)]">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {Object.values(DEFAULT_WIDGET_CONFIGS).map((widget) => (
                <motion.div
                  key={widget.type}
                  variants={item}
                  className="relative group overflow-hidden rounded-2xl bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col h-full p-5">
                    <div className="flex items-center mb-3">
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full mr-3"
                        style={{
                          backgroundColor: `${widget.color}20`,
                          color: widget.color,
                        }}
                      >
                        <widget.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {widget.title}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">
                      {widget.description}
                    </p>

                    <Button
                      onClick={() => handleAddWidget(widget.type)}
                      className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-0 transition-colors duration-200"
                      variant="outline"
                    >
                      <span>Add</span>
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
              className="mt-8"
            >
              <Card className="bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800">
                      <Code className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </div>
                    <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                      Import Widget from JSON
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Paste a widget configuration JSON to create a custom widget
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {jsonError && (
                    <Alert
                      variant="destructive"
                      className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30 text-red-800 dark:text-red-300 rounded-xl"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{jsonError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label
                          htmlFor="json-input"
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          Widget JSON Configuration
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={loadExampleJson}
                          className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white h-7"
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
                        className="min-h-32 font-mono text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl"
                      />
                    </div>
                    <Button
                      onClick={handleJsonImport}
                      className="w-full bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-xl h-10"
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

export default AddWidgetDrawer;

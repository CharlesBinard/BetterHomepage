"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import WidgetBaseConfigForm, {
  baseFormSchema,
} from "@/components/widgets/base/widget-base-config-form";
import { WidgetDatetimeData } from "@/components/widgets/datetime/widget-datetime";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const datetimeSchema = z.object({
  timeFormat: z.enum(["12h", "24h"] as const).optional(),
  dateFormat: z
    .enum(["short", "medium", "long", "full", "custom"] as const)
    .optional(),
  customDateFormat: z.string().optional(),
  display: z.enum(["dateOnly", "timeOnly", "both"] as const).optional(),
  showSeconds: z.boolean().optional(),
  showDayOfWeek: z.boolean().optional(),
  textAlign: z.enum(["left", "center", "right"] as const).optional(),
  timeClassName: z.string().optional(),
  dateClassName: z.string().optional(),
  containerClassName: z.string().optional(),
  useCustomFont: z.boolean().optional(),
  fontFamily: z.string().optional(),
});

export const combinedSchema = baseFormSchema.merge(datetimeSchema);
export type WidgetDatetimeFormData = z.infer<typeof combinedSchema>;

export interface WidgetDatetimeConfigFormProps {
  data: WidgetDatetimeData;
  onSubmit: (data: WidgetDatetimeData) => void;
}

const WidgetDatetimeConfigForm = React.memo(
  ({ data, onSubmit }: WidgetDatetimeConfigFormProps) => {
    const isInitialRender = useRef(true);
    const [hasChanges, setHasChanges] = useState(false);

    const defaultValues = useMemo(
      () => ({
        ...data,
        timeFormat: data.timeFormat || "24h",
        dateFormat: data.dateFormat || "medium",
        customDateFormat: data.customDateFormat || "yyyy-MM-dd",
        display: data.display || "both",
        showSeconds: data.showSeconds !== false,
        showDayOfWeek: data.showDayOfWeek !== false,
        textAlign: data.textAlign || "center",
        useCustomFont: data.useCustomFont || false,
        fontFamily: data.fontFamily || "",
      }),
      [data]
    );

    const form = useForm<WidgetDatetimeFormData>({
      resolver: zodResolver(combinedSchema),
      defaultValues,
      mode: "onChange",
    });

    const handleSubmit = useMemo(
      () => (formData: WidgetDatetimeFormData) => {
        setHasChanges(false);
        onSubmit({
          ...data,
          ...formData,
        });
      },
      [data, onSubmit]
    );

    React.useEffect(() => {
      if (isInitialRender.current) {
        isInitialRender.current = false;
        return;
      }

      const subscription = form.watch(() => {
        setHasChanges(true);
      });

      return () => subscription.unsubscribe();
    }, [form]);

    const watchDateFormat = form.watch("dateFormat");
    const watchDisplay = form.watch("display");
    const watchUseCustomFont = form.watch("useCustomFont");

    return (
      <FormProvider {...form}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-6">
              {/* Base Widget Configuration */}
              <WidgetBaseConfigForm />

              {/* Display Options */}
              <div className="space-y-6">
                <div className="text-lg font-semibold">Date/Time Display</div>

                <FormField
                  control={form.control}
                  name="display"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Display Mode</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="both" />
                            <Label htmlFor="both">
                              Show both date and time
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dateOnly" id="dateOnly" />
                            <Label htmlFor="dateOnly">Show date only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="timeOnly" id="timeOnly" />
                            <Label htmlFor="timeOnly">Show time only</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time Format Options */}
                {(watchDisplay === "both" || watchDisplay === "timeOnly") && (
                  <>
                    <FormField
                      control={form.control}
                      name="timeFormat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Format</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select time format" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent position="popper">
                              <SelectItem value="12h">
                                12-hour (AM/PM)
                              </SelectItem>
                              <SelectItem value="24h">24-hour</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="showSeconds"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Show Seconds
                            </FormLabel>
                            <FormDescription>
                              Display seconds in the time
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Date Format Options */}
                {(watchDisplay === "both" || watchDisplay === "dateOnly") && (
                  <>
                    <FormField
                      control={form.control}
                      name="dateFormat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Format</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select date format" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent position="popper">
                              <SelectItem value="short">
                                Short (MM/DD/YYYY)
                              </SelectItem>
                              <SelectItem value="medium">
                                Medium (Month DD, YYYY)
                              </SelectItem>
                              <SelectItem value="long">
                                Long (Month DD, YYYY with weekday)
                              </SelectItem>
                              <SelectItem value="full">
                                Full (detailed format)
                              </SelectItem>
                              <SelectItem value="custom">
                                Custom format
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchDateFormat === "custom" && (
                      <FormField
                        control={form.control}
                        name="customDateFormat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom Date Format</FormLabel>
                            <FormControl>
                              <Input placeholder="yyyy-MM-dd" {...field} />
                            </FormControl>
                            <FormDescription>
                              Use yyyy for year, MM for month, dd for day
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="showDayOfWeek"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Show Day of Week
                            </FormLabel>
                            <FormDescription>
                              Display the day name (e.g., Monday, Tuesday)
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Text Alignment */}
                <FormField
                  control={form.control}
                  name="textAlign"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text Alignment</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select text alignment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper">
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Font Options */}
                <FormField
                  control={form.control}
                  name="useCustomFont"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Use Custom Font
                        </FormLabel>
                        <FormDescription>
                          Specify a custom font family
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {watchUseCustomFont && (
                  <FormField
                    control={form.control}
                    name="fontFamily"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Font Family</FormLabel>
                        <FormControl>
                          <Input placeholder="Arial, sans-serif" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a valid CSS font family value
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Advanced Styling (optional) */}
              <div className="space-y-4">
                <div className="text-lg font-semibold">Advanced Styling</div>

                <FormField
                  control={form.control}
                  name="containerClassName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Container Class</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="flex flex-col justify-center items-center h-full"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Custom Tailwind classes for the container
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeClassName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Element Class</FormLabel>
                      <FormControl>
                        <Input placeholder="text-3xl font-bold" {...field} />
                      </FormControl>
                      <FormDescription>
                        Custom Tailwind classes for the time display
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateClassName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Element Class</FormLabel>
                      <FormControl>
                        <Input placeholder="text-xl mt-2" {...field} />
                      </FormControl>
                      <FormDescription>
                        Custom Tailwind classes for the date display
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!hasChanges && !isInitialRender.current}
            >
              Save
            </Button>
          </form>
        </Form>
      </FormProvider>
    );
  }
);

WidgetDatetimeConfigForm.displayName = "WidgetDatetimeConfigForm";

export default WidgetDatetimeConfigForm;

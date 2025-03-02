"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WidgetBaseConfigForm, {
  baseFormSchema,
} from "@/components/widgets/base/widget-base-config-form";
import { WidgetBookmarkData } from "@/components/widgets/bookmark/widget-bookmark";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const bookmarkItemSchema = z.object({
  text: z.string().min(1, "Required minimum 1 character"),
  url: z.string().url({ message: "Invalid URL" }),
  logo: z
    .union([z.string().url({ message: "Invalid logo URL" }), z.literal("")])
    .optional(),
  customColor: z.union([z.string(), z.literal("")]).optional(),
  description: z.union([z.string(), z.literal("")]).optional(),
});

const bookmarksSchema = z.object({
  bookmarks: z
    .array(bookmarkItemSchema)
    .min(1, "At least one bookmark is required"),
  displayStyle: z.enum(["list", "grid", "compact"]).optional(),
  hoverEffect: z.enum(["none", "scale", "glow", "underline"]).optional(),
  iconPosition: z.enum(["left", "top"]).optional(),
  iconSize: z.number().min(16).max(64).optional(),
  showLabels: z.boolean().optional(),
  bookmarksContainerClassName: z.string().optional(),
  itemClassName: z.string().optional(),
  showFavicon: z.boolean().optional(),
  useCustomFallbackIcon: z.boolean().optional(),
  fallbackIconUrl: z.string().optional(),
  borderRadius: z.string().optional(),
});

export const combinedSchema = baseFormSchema.merge(bookmarksSchema);
export type WidgetBookmarkFormData = z.infer<typeof combinedSchema>;

export interface WidgetBookmarkConfigFormProps {
  data: WidgetBookmarkData;
  onSubmit: (data: WidgetBookmarkData) => void;
}

const WidgetBookmarkConfigForm: React.FC<WidgetBookmarkConfigFormProps> = ({
  data,
  onSubmit,
}) => {
  const defaultValues: WidgetBookmarkFormData = {
    ...data,
    bookmarks: data.bookmarks,
    displayStyle: data.displayStyle || "list",
    hoverEffect: data.hoverEffect || "none",
    iconPosition: data.iconPosition || "left",
    iconSize: data.iconSize || 24,
    showLabels: data.showLabels !== false,
    bookmarksContainerClassName: data.bookmarksContainerClassName || "",
    itemClassName: data.itemClassName || "",
    showFavicon: data.showFavicon !== false,
    useCustomFallbackIcon: data.useCustomFallbackIcon || false,
    fallbackIconUrl: data.fallbackIconUrl || "",
    borderRadius: data.borderRadius || "rounded-md",
  };

  const methods = useForm<WidgetBookmarkFormData>({
    resolver: zodResolver(combinedSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "bookmarks",
  });

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit((formData) => {
            onSubmit({
              ...data,
              ...formData,
            });
          })}
          className="space-y-4"
        >
          <Tabs defaultValue="bookmarks">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="bookmarks" className="space-y-4 py-4">
              <WidgetBaseConfigForm />

              {fields.map((field, index) => (
                <Card key={field.id} className="relative overflow-hidden">
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 h-7 w-7 p-0"
                  >
                    ✕
                  </Button>

                  <CardContent className="pt-6 pb-2 px-4 space-y-3">
                    <h4 className="text-lg font-medium">
                      Bookmark {index + 1}
                    </h4>

                    <FormField
                      control={methods.control}
                      name={`bookmarks.${index}.text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Bookmark name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={methods.control}
                      name={`bookmarks.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={methods.control}
                      name={`bookmarks.${index}.logo`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Logo URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/logo.png"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Leave empty to use favicon
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={methods.control}
                      name={`bookmarks.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Short description"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={methods.control}
                      name={`bookmarks.${index}.customColor`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Text Color</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input
                                type="color"
                                className="w-10 p-1 h-10"
                                {...field}
                                value={field.value || "#000000"}
                              />
                            </FormControl>
                            <FormControl>
                              <Input
                                placeholder="#RRGGBB"
                                className="flex-1"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Leave empty to use default color
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                onClick={() =>
                  append({
                    text: "",
                    url: "",
                    logo: "",
                    description: "",
                    customColor: "",
                  })
                }
              >
                Add Bookmark
              </Button>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4 py-4">
              <Card>
                <CardContent className="pt-6 pb-2 px-4 space-y-4">
                  <h4 className="text-lg font-medium">Layout & Style</h4>

                  <FormField
                    control={methods.control}
                    name="displayStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Style</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row gap-4"
                          >
                            <div className="flex items-center space-x-2 border rounded-md p-2">
                              <RadioGroupItem value="list" id="ds-list" />
                              <Label htmlFor="ds-list">List</Label>
                            </div>

                            <div className="flex items-center space-x-2 border rounded-md p-2">
                              <RadioGroupItem value="grid" id="ds-grid" />
                              <Label htmlFor="ds-grid">Grid</Label>
                            </div>

                            <div className="flex items-center space-x-2 border rounded-md p-2">
                              <RadioGroupItem value="compact" id="ds-compact" />
                              <Label htmlFor="ds-compact">Compact</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>
                          Choose how your bookmarks will be arranged
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={methods.control}
                    name="iconPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon Position</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row gap-4"
                          >
                            <div className="flex items-center space-x-2 border rounded-md p-2">
                              <RadioGroupItem value="left" id="ip-left" />
                              <Label htmlFor="ip-left">Left</Label>
                            </div>

                            <div className="flex items-center space-x-2 border rounded-md p-2">
                              <RadioGroupItem value="top" id="ip-top" />
                              <Label htmlFor="ip-top">Top</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={methods.control}
                    name="hoverEffect"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hover Effect</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select hover effect" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="scale">Scale</SelectItem>
                              <SelectItem value="glow">Glow</SelectItem>
                              <SelectItem value="underline">
                                Underline
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Effect applied when hovering over bookmarks
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={methods.control}
                    name="iconSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon Size: {field.value}px</FormLabel>
                        <FormControl>
                          <Slider
                            min={16}
                            max={64}
                            step={2}
                            value={[field.value || 24]}
                            onValueChange={(value: number[]) =>
                              field.onChange(value[0])
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={methods.control}
                    name="borderRadius"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Border Radius</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select border radius" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rounded-none">None</SelectItem>
                              <SelectItem value="rounded-sm">Small</SelectItem>
                              <SelectItem value="rounded-md">Medium</SelectItem>
                              <SelectItem value="rounded-lg">Large</SelectItem>
                              <SelectItem value="rounded-full">Full</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={methods.control}
                      name="showLabels"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-2 border rounded-md">
                          <div className="space-y-0.5">
                            <FormLabel>Show Labels</FormLabel>
                            <FormDescription>
                              Display bookmark text
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

                    <FormField
                      control={methods.control}
                      name="showFavicon"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-2 border rounded-md">
                          <div className="space-y-0.5">
                            <FormLabel>Show Icons</FormLabel>
                            <FormDescription>
                              Display bookmark icons
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 py-4">
              <Card>
                <CardContent className="pt-6 pb-2 px-4 space-y-4">
                  <h4 className="text-lg font-medium">Advanced Options</h4>

                  <FormField
                    control={methods.control}
                    name="bookmarksContainerClassName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Container Class Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tailwind CSS classes"
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
                    control={methods.control}
                    name="itemClassName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Class Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tailwind CSS classes"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Custom Tailwind classes for each bookmark item
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={methods.control}
                    name="useCustomFallbackIcon"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-2 border rounded-md">
                        <div className="space-y-0.5">
                          <FormLabel>Use Custom Fallback Icon</FormLabel>
                          <FormDescription>
                            Use a custom fallback icon for broken images
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

                  {methods.watch("useCustomFallbackIcon") && (
                    <FormField
                      control={methods.control}
                      name="fallbackIconUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fallback Icon URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/fallback-icon.svg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Icon to use when favicon cannot be loaded
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-2">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default WidgetBookmarkConfigForm;

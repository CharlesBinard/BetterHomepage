"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WidgetBaseConfigForm, {
  baseFormSchema,
} from "@/components/widgets/base/widget-base-config-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { defaultSearchData, WidgetSearchData } from "./widget-search";

const searchSchema = z.object({
  engine: z.enum(["google", "bing", "duckduckgo", "ecosia"]),
  newTab: z.boolean(),
  displayMode: z.enum(["minimal", "standard", "advanced"]),
  defaultScope: z.enum(["web", "images", "videos", "news", "maps"]),
  language: z.enum([
    "auto",
    "en",
    "fr",
    "de",
    "es",
    "it",
    "pt",
    "ru",
    "ja",
    "zh",
  ]),
  region: z.enum([
    "auto",
    "us",
    "uk",
    "ca",
    "au",
    "in",
    "fr",
    "de",
    "jp",
    "br",
  ]),
  safeSearch: z.boolean(),
  showQuickLinks: z.boolean(),
  trackHistory: z.boolean(),
  maxHistoryItems: z.number().min(0).max(20),
  customPlaceholder: z.string().optional(),
  autoFocus: z.boolean(),
});

export const combinedSchema = baseFormSchema.merge(searchSchema);
export type WidgetSearchFormData = z.infer<typeof combinedSchema>;

export interface WidgetSearchConfigFormProps {
  data: WidgetSearchData;
  onSubmit: (data: WidgetSearchData) => void;
}

const WidgetSearchConfigForm: React.FC<WidgetSearchConfigFormProps> = ({
  data,
  onSubmit,
}) => {
  const defaultValues: WidgetSearchFormData = {
    ...data,
    engine: data.engine || defaultSearchData.engine,
    newTab: data.newTab ?? defaultSearchData.newTab,
    displayMode: data.displayMode || defaultSearchData.displayMode,
    defaultScope: data.defaultScope || defaultSearchData.defaultScope,
    language: data.language || defaultSearchData.language,
    region: data.region || defaultSearchData.region,
    safeSearch: data.safeSearch ?? defaultSearchData.safeSearch,
    showQuickLinks: data.showQuickLinks ?? defaultSearchData.showQuickLinks,
    trackHistory: data.trackHistory ?? defaultSearchData.trackHistory,
    maxHistoryItems: data.maxHistoryItems || defaultSearchData.maxHistoryItems,
    customPlaceholder:
      data.customPlaceholder || defaultSearchData.customPlaceholder,
    autoFocus: data.autoFocus ?? defaultSearchData.autoFocus,
  };

  const methods = useForm<WidgetSearchFormData>({
    resolver: zodResolver(combinedSchema),
    defaultValues,
  });

  const displayMode = methods.watch("displayMode");
  const trackHistory = methods.watch("trackHistory");

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit((formData) => {
            onSubmit({
              ...data,
              ...formData,
              // Preserve search history when updating config
              searchHistory: data.searchHistory || [],
            });
          })}
          className="space-y-4"
        >
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {/* Base Config Form */}
              <WidgetBaseConfigForm />

              {/* Search Engine Field */}
              <FormField
                control={methods.control}
                name="engine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Engine</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select search engine" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="bing">Bing</SelectItem>
                          <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>
                          <SelectItem value="ecosia">Ecosia</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* New Tab Field */}
              <FormField
                control={methods.control}
                name="newTab"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Open in New Tab</FormLabel>
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

              {/* Default Scope Field */}
              <FormField
                control={methods.control}
                name="defaultScope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Search Scope</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select default scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web">Web</SelectItem>
                          <SelectItem value="images">Images</SelectItem>
                          <SelectItem value="videos">Videos</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="maps">Maps</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              {/* Display Mode Field */}
              <FormField
                control={methods.control}
                name="displayMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Mode</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select display mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Minimal: Just the search box. Standard: Search with scope
                      options. Advanced: All features.
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* Custom Placeholder Field */}
              <FormField
                control={methods.control}
                name="customPlaceholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Placeholder Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Search the web..." />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* AutoFocus Field */}
              <FormField
                control={methods.control}
                name="autoFocus"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Auto-focus search input</FormLabel>
                      <FormDescription>
                        Focus the search input automatically when widget is
                        loaded
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

              {/* Show Quick Links Field - only relevant for advanced mode */}
              {displayMode === "advanced" && (
                <FormField
                  control={methods.control}
                  name="showQuickLinks"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Show Quick Links</FormLabel>
                        <FormDescription>
                          Display quick access links for common searches
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
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              {/* Language Field */}
              <FormField
                control={methods.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Language</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">
                            Auto (Browser Default)
                          </SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="it">Italian</SelectItem>
                          <SelectItem value="pt">Portuguese</SelectItem>
                          <SelectItem value="ru">Russian</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Region Field */}
              <FormField
                control={methods.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Region</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto (IP-based)</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="jp">Japan</SelectItem>
                          <SelectItem value="br">Brazil</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Safe Search Field */}
              <FormField
                control={methods.control}
                name="safeSearch"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Safe Search</FormLabel>
                      <FormDescription>
                        Filter explicit content from search results
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

              <Separator className="my-4" />

              {/* History Settings */}
              <div className="space-y-4">
                <FormField
                  control={methods.control}
                  name="trackHistory"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Track Search History</FormLabel>
                        <FormDescription>
                          Save recent searches for quick access
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

                {trackHistory && (
                  <FormField
                    control={methods.control}
                    name="maxHistoryItems"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Max History Items</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span>0</span>
                              <span className="font-medium">{value}</span>
                              <span>20</span>
                            </div>
                            <Slider
                              min={0}
                              max={20}
                              step={1}
                              defaultValue={[value]}
                              onValueChange={(vals) => onChange(vals[0])}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Maximum number of search history items to retain
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </FormProvider>
  );
};

export default WidgetSearchConfigForm;

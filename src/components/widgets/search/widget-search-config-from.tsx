"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { defaultSearchData, WidgetSearchData } from "./widget-search";

const searchSchema = z.object({
  engine: z.enum(["google", "bing", "duckduckgo", "ecosia"]),
  newTab: z.boolean(),
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
    newTab: data.newTab || defaultSearchData.newTab,
  };

  const methods = useForm<WidgetSearchFormData>({
    resolver: zodResolver(combinedSchema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit((formData) => {
            onSubmit({
              ...data,
              ...formData, // Update widget data
            });
          })}
          className="space-y-4"
        >
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
                  <Select value={field.value} onValueChange={field.onChange}>
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

          {/* Submit Button */}
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </FormProvider>
  );
};

export default WidgetSearchConfigForm;

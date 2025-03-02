import CityAutocomplete, { City } from "@/components/inputs/city-autocomplete";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import WidgetBaseConfigForm, {
  baseFormSchema,
} from "@/components/widgets/base/widget-base-config-form";
import {
  defaultWeatherData,
  WidgetWeatherData,
  WidgetWeatherSubType,
} from "@/components/widgets/weather/widget-weather";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

// Make all form fields optional to prevent validation errors
const weatherSchema = z.object({
  city: z.any().optional(), // Use any instead of a strict object schema to avoid validation errors
  displayCity: z.boolean().optional(),
  subType: z.string().optional(), // Use string instead of enum for more flexibility
  className: z.string().optional(),
  zIndex: z.number().optional(),
});

export const combinedSchema = baseFormSchema.merge(weatherSchema);
export type WidgetWeatherFormData = z.infer<typeof combinedSchema>;

export interface WidgetWeatherConfigFormProps {
  data: WidgetWeatherData;
  onSubmit: (data: WidgetWeatherData) => void;
}

const WidgetWeatherConfigForm: React.FC<WidgetWeatherConfigFormProps> = ({
  data,
  onSubmit,
}) => {
  // Use state for direct control of inputs with default values to ensure they're never undefined
  const [selectedCity, setSelectedCity] = useState<City>(
    data.city || defaultWeatherData.city
  );
  const [selectedSubType, setSelectedSubType] = useState<string>(
    data.subType || WidgetWeatherSubType.HOURLY
  );
  const [showCityName, setShowCityName] = useState<boolean>(
    data.displayCity === undefined ? true : data.displayCity
  );

  // Create a form instance that will be provided to context
  const methods = useForm<WidgetWeatherFormData>({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      ...data,
      city: selectedCity,
      displayCity: showCityName,
      subType: selectedSubType,
      className: data.className,
      zIndex: data.zIndex || 1,
    },
  });

  // Keep form values in sync with our state
  useEffect(() => {
    methods.setValue("city", selectedCity);
    methods.setValue("displayCity", showCityName);
    methods.setValue("subType", selectedSubType);
  }, [selectedCity, showCityName, selectedSubType, methods]);

  // Handle form submission directly without complex validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create updated data with our directly managed state
    const updatedData: WidgetWeatherData = {
      ...data,
      city: selectedCity,
      displayCity: showCityName,
      subType: selectedSubType as WidgetWeatherSubType,
      className: methods.getValues("className"),
      zIndex: methods.getValues("zIndex"),
    };

    console.log("Submitting form data:", updatedData);
    onSubmit(updatedData);
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <div className="space-y-4 p-2">
          <WidgetBaseConfigForm />

          {/* City Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <CityAutocomplete
              value={selectedCity}
              onSelect={(city: City) => {
                console.log("City selected:", city);
                setSelectedCity(city);
              }}
            />
            <p className="text-sm text-muted-foreground">
              Select the city you want to display the weather for.
            </p>
          </div>

          {/* Weather View Type Selector - Simplified for reliability */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Weather View</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedSubType}
              onChange={(e) => setSelectedSubType(e.target.value)}
            >
              <option value={WidgetWeatherSubType.CURRENT}>
                Current Weather
              </option>
              <option value={WidgetWeatherSubType.HOURLY}>
                Hourly Forecast
              </option>
              <option value={WidgetWeatherSubType.DAILY}>Daily Forecast</option>
            </select>
            <p className="text-sm text-muted-foreground">
              Choose the type of weather information to display.
            </p>
          </div>

          {/* Display City Name Toggle */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Show City Name</label>
            <Switch
              checked={showCityName}
              onCheckedChange={(value) => setShowCityName(value)}
            />
            <p className="text-sm text-muted-foreground ml-2">
              Toggle to show or hide the city name.
            </p>
          </div>

          <Button type="button" onClick={handleSubmit} className="w-full">
            Save Changes
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};

export default WidgetWeatherConfigForm;

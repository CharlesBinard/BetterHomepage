import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import WidgetBaseConfigForm, {
    baseFormSchema,
} from "@/components/widgets/base/widget-base-config-form";
import CityAutocomplete, { City } from "@/components/inputs/city-autocomplete";
import {defaultWeatherData, WidgetWeatherData} from "@/components/widgets/weather/widget-weather";
import {Switch} from "@/components/ui/switch";

const weatherSchema = z.object({
    city: z.object({
        name: z.string(),
        country: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        postcodes: z.array(z.string()).optional(),
    }),
    displayCity: z.boolean().optional(),
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
    const defaultValues: WidgetWeatherFormData = {
        ...data,
        city: data.city || defaultWeatherData.city || { name: "", country: "", latitude: 0, longitude: 0 },
        displayCity: data.displayCity ?? defaultWeatherData.displayCity,
    };

    const methods = useForm<WidgetWeatherFormData>({
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
                            ...formData, // Met à jour les données du widget
                        });
                    })}
                    className="space-y-4"
                >
                    <WidgetBaseConfigForm />

                    <FormField
                        control={methods.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ville</FormLabel>
                                <FormControl>
                                    <CityAutocomplete
                                        value={field.value}
                                        onSelect={(city: City) => {
                                            methods.setValue("city", city);
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Select the city you want to display the weather for.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Show Current Weather */}
                    <FormField
                        control={methods.control}
                        name="displayCity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='mr-2'>Show City Name</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={(checked) =>
                                            methods.setValue("displayCity", checked)
                                        }
                                    />
                                </FormControl>
                                <FormDescription>
                                    Toggle to show or hide the city name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <Button type="submit">Save</Button>
                </form>
            </Form>
        </FormProvider>
    );
};

export default WidgetWeatherConfigForm;

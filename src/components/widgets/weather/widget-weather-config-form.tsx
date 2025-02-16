// components/widgets/weather/widget-weather-config-form.tsx
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
import { defaultWeatherConfig } from "@/components/widgets/weather/widget-weather";
import CityAutocomplete, {City} from "@/components/inputs/city-autocomplete";

const weatherSchema = z.object({
    city: z.object({
        name: z.string(),
        country: z.string(),
        latitude: z.number(),
        longitude: z.number(),
    })
});

export const combinedSchema = baseFormSchema.merge(weatherSchema);
export type WidgetWeatherConfig = z.infer<typeof combinedSchema>;

export interface WidgetWeatherConfigFormProps {
    config?: WidgetWeatherConfig;
    onSubmit: (data: WidgetWeatherConfig) => void;
}

const WidgetWeatherConfigForm: React.FC<WidgetWeatherConfigFormProps> = ({
                                                                             config,
                                                                             onSubmit,
                                                                         }) => {
    const defaultValues: WidgetWeatherConfig = config ?? {
        ...defaultWeatherConfig,
        city: defaultWeatherConfig.city
    };

    const methods = useForm<WidgetWeatherConfig>({
        resolver: zodResolver(combinedSchema),
        defaultValues,
    });

    return (
        <FormProvider {...methods}>
            <Form {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
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
                                        onSelect={(data: City) => {
                                            methods.setValue("city", data);
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


                    <Button type="submit">Save</Button>
                </form>
            </Form>
        </FormProvider>
    );
};

export default WidgetWeatherConfigForm;
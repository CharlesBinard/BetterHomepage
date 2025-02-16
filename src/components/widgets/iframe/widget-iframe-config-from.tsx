// src/components/widgets/iframe/WidgetIframeConfigForm.tsx
import React from "react";
import {useForm, FormProvider} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import WidgetBaseConfigForm, {
    baseFormSchema,
} from "@/components/widgets/base/widget-base-config-form";
import {defaultIframeConfig} from "@/components/widgets/iframe/widget-iframe";

const iframeSchema = z.object({
    url: z.string().url({message: "Invalid URL"}),
    iframeClassName: z.string().optional(),
});

export const combinedSchema = baseFormSchema.merge(iframeSchema);
export type WidgetIframeConfig = z.infer<typeof combinedSchema>;

export interface WidgetIframeConfigFormProps {
    config?: WidgetIframeConfig;
    onSubmit: (data: WidgetIframeConfig) => void;
}

const WidgetIframeConfigForm: React.FC<WidgetIframeConfigFormProps> = ({
                                                                           config,
                                                                           onSubmit,
                                                                       }) => {
    const defaultValues: WidgetIframeConfig = config ?? {
        ...defaultIframeConfig
    };

    const methods = useForm<WidgetIframeConfig>({
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
                    <WidgetBaseConfigForm/>

                    <FormField
                        control={methods.control}
                        name="url"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter the URL for the iframe.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={methods.control}
                        name="iframeClassName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Iframe className</FormLabel>
                                <FormControl>
                                    <Input placeholder="rounded-lg" {...field} />
                                </FormControl>
                                    <FormDescription>
                                        Iframe className. Based on
                                        <a
                                            href="https://tailwindcss.com/docs"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            {` Tailwind CSS documentation`}
                                        </a>.
                                    </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </FormProvider>
    );
};

export default WidgetIframeConfigForm;

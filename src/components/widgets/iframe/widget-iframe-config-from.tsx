"use client";

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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import WidgetBaseConfigForm, {
    baseFormSchema,
} from "@/components/widgets/base/widget-base-config-form";
import {defaultIframeData, WidgetIframeData} from "@/components/widgets/iframe/widget-iframe";

const referrerPolicyValues = [
    "no-referrer",
    "no-referrer-when-downgrade",
    "origin",
    "origin-when-cross-origin",
    "same-origin",
    "strict-origin",
    "strict-origin-when-cross-origin",
    "unsafe-url",
] as const;

const iframeSchema = z.object({
    url: z.string().url({ message: "Invalid URL" }),
    iframeClassName: z.string().optional(),
    sandbox: z.string().optional(),
    allow: z.string().optional(),
    loading: z.enum(["lazy", "eager"]).optional(),
    referrerPolicy: z.enum(referrerPolicyValues).optional(),

});

export const combinedSchema = baseFormSchema.merge(iframeSchema);
export type WidgetIframeFormData = z.infer<typeof combinedSchema>;

export interface WidgetIframeConfigFormProps {
    data: WidgetIframeData;
    onSubmit: (data: WidgetIframeData) => void;
}

const WidgetIframeConfigForm: React.FC<WidgetIframeConfigFormProps> = ({
                                                                           data,
                                                                           onSubmit,
                                                                       }) => {
    const defaultValues: WidgetIframeFormData = {
        ...data,
        url: data.url || defaultIframeData.url || "www.google.com",
        iframeClassName: data.iframeClassName || defaultIframeData.iframeClassName,
        sandbox: data.sandbox || defaultIframeData.sandbox,
        allow: data.allow || defaultIframeData.allow,
        loading: data.loading || defaultIframeData.loading,
        referrerPolicy: data.referrerPolicy || defaultIframeData.referrerPolicy || "no-referrer",
    };

    const methods = useForm<WidgetIframeFormData>({
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

                    {/* URL Field */}
                    <FormField
                        control={methods.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com" {...field} />
                                </FormControl>
                                <FormDescription>Enter the URL for the iframe.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Iframe ClassName Field */}
                    <FormField
                        control={methods.control}
                        name="iframeClassName"
                        render={({ field }) => (
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Sandbox Field */}
                    <FormField
                        control={methods.control}
                        name="sandbox"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sandbox</FormLabel>
                                <FormControl>
                                    <Input placeholder="allow-scripts allow-same-origin" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Configure sandbox attributes to restrict iframe behavior. Learn more in the{" "}
                                    <a
                                        href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        MDN documentation
                                    </a>.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Allow Field */}
                    <FormField
                        control={methods.control}
                        name="allow"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Allow</FormLabel>
                                <FormControl>
                                    <Input placeholder="fullscreen" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Specify permissions for the iframe (e.g., fullscreen, camera, microphone).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Loading Field */}
                    <FormField
                        control={methods.control}
                        name="loading"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loading</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value || "lazy"}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select loading behavior" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lazy">Lazy</SelectItem>
                                            <SelectItem value="eager">Eager</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    Choose how the iframe content should load: lazy (default) or eager.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Referrer Policy Field */}
                    <FormField
                        control={methods.control}
                        name="referrerPolicy"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Referrer Policy</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value || "no-referrer"}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select referrer policy" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[200]">
                                            {referrerPolicyValues.map((value) => (
                                                <SelectItem key={value} value={value}>
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    Configure the referrer policy for the iframe. Learn more in the{" "}
                                    <a
                                        href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        MDN documentation
                                    </a>.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </FormProvider>
    );
};

export default WidgetIframeConfigForm;

import React from "react";
import { useFormContext} from "react-hook-form";
import {z} from "zod";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";


export const baseFormSchema = z.object({
    className: z.string().optional(),
    zIndex: z.coerce.number().min(1).max(100).optional(),
});

const WidgetBaseConfigForm = () => {
    const { control } = useFormContext();

    return (
        <>
            <FormField
                control={control}
                name="className"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Widget classname</FormLabel>
                        <FormControl>
                            <Input placeholder="Classe CSS" {...field} />
                        </FormControl>
                        <FormDescription>
                            Widget className. Based on
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

            <FormField
                control={control}
                name="zIndex"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>z-index</FormLabel>
                        <FormControl>
                            <Input placeholder="z-index" type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                            z-index of the widget.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
};

export default WidgetBaseConfigForm;

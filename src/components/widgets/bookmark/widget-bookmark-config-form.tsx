// WidgetBookmarkConfigForm.tsx
import React from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import WidgetBaseConfigForm, {
    baseFormSchema,
} from "@/components/widgets/base/widget-base-config-form";
import {defaultBookmarkConfig} from "@/components/widgets/bookmark/widget-bookmark";

const bookmarkItemSchema = z.object({
    text: z.string().min(1, "Required minimum 1 character"),
    url: z.string().url({ message: "Invalid URL" }),
    logo: z
        .union([z.string().url({ message: "Invalid logo URL" }), z.literal("")])
        .optional(),
});

const bookmarksSchema = z.object({
    bookmarks: z.array(bookmarkItemSchema).min(1, "At least one bookmark is required"),
    bookmarksContainerClassName: z.string().optional(),
});

export const combinedSchema = baseFormSchema.merge(bookmarksSchema);
export type WidgetBookmarkConfig = z.infer<typeof combinedSchema>;

export interface WidgetBookmarkConfigFormProps {
    config?: WidgetBookmarkConfig;
    onSubmit: (data: WidgetBookmarkConfig) => void;
}

const WidgetBookmarkConfigForm: React.FC<WidgetBookmarkConfigFormProps> = ({
                                                                               config,
                                                                               onSubmit,
                                                                           }) => {
    const defaultValues: WidgetBookmarkConfig = config ?? {
        ...defaultBookmarkConfig
    };

    const methods = useForm<WidgetBookmarkConfig>({
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
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                    <WidgetBaseConfigForm />

                    <FormField
                        control={methods.control}
                        name="bookmarksContainerClassName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bookmarks container classname</FormLabel>
                                <FormControl>
                                    <Input placeholder="Classe CSS" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Bookmark Container className. Based on
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

                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="border p-4 rounded-md space-y-2 relative"
                        >
                            <h4 className="text-lg font-bold">Bookmark {index + 1}</h4>
                            <FormField
                                control={methods.control}
                                name={`bookmarks.${index}.text`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Text</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Bookmark name" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the text for the bookmark.
                                        </FormDescription>
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
                                            <Input placeholder="https://example.com" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the URL of the bookmark.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={methods.control}
                                name={`bookmarks.${index}.logo`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Logo URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://example.com/logo.png"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the URL for the bookmark&apos;s logo.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                variant="destructive"
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute top-2 right-2"
                            >
                                Delete
                            </Button>
                        </div>
                    ))}

                    <div className='flex justify-between'>
                        <Button
                            type="button"
                            onClick={() =>
                                append({
                                    text: "",
                                    url: "",
                                    logo: "",
                                })
                            }
                        >
                            Add Bookmark
                        </Button>

                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </FormProvider>
    );
};

export default WidgetBookmarkConfigForm;

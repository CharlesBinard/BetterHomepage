import React, {useState, useCallback} from "react";
import {Button} from "@/components/ui/button";
import {Settings} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {WidgetType} from "@/components/widgets/widget-types";
import {ScrollArea} from "@/components/ui/scroll-area";

export interface WidgetConfigDialogProps {
    type: WidgetType;
    children: React.ReactNode;
}

const useWidgetConfigDialog =() => {
    const [open, setOpen] = useState(false);

    const openDialog = useCallback(() => {
        setOpen(true);
    }, []);

    const closeDialog = useCallback(() => {
        setOpen(false);
    }, []);

    const WidgetConfigDialog: React.FC<WidgetConfigDialogProps> = ({
                                                                       type,
                                                                       children,
                                                                   }) => {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 left-1 z-100 opacity-0 group-hover:opacity-100 transition-opacity"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            openDialog();
                        }}
                    >
                        <Settings/>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px] " style={{zIndex: 101}}>
                    <DialogHeader>
                        <DialogTitle>Edit widget: {type}</DialogTitle>
                        <DialogDescription>
                            Make changes to your widget here. Click save when you&#39;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[80vh] rounded-md grid gap-4 p-4">
                            {children}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );
    };

    return {WidgetConfigDialog, openDialog, closeDialog};
}

export default useWidgetConfigDialog;
import { Button } from "@/components/ui/button";
import useEditMode from "@/hooks/useEditMode";
import { EditIcon, EyeIcon } from "lucide-react";
import React from "react";

const EditModeToggle: React.FC = () => {
  const { editMode, setEditMode } = useEditMode();

  return (
    <Button
      variant={editMode ? "default" : "outline"}
      size="icon"
      className={`
        shadow-sm transition-all duration-200 font-medium
        ${
          editMode
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
        }
      `}
      onClick={() => setEditMode(!editMode)}
      aria-label={editMode ? "Exit edit mode" : "Enter edit mode"}
    >
      {editMode ? (
        <EditIcon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <EyeIcon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
};

export default EditModeToggle;

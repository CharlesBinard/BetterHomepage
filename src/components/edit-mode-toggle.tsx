import { Button } from "@/components/ui/button";
import useEditMode from "@/hooks/useEditMode";
import { EditIcon, EyeIcon } from "lucide-react";
import React from "react";

const EditModeToggle: React.FC = () => {
  const { editMode, setEditMode } = useEditMode();

  return (
    <Button
      variant="outline"
      size="sm"
      className="bg-white dark:bg-gray-800 shadow-sm"
      onClick={() => setEditMode(!editMode)}
      aria-label={editMode ? "Exit edit mode" : "Enter edit mode"}
    >
      {editMode ? (
        <>
          <EyeIcon className="h-4 w-4 mr-2" />
          View Mode
        </>
      ) : (
        <>
          <EditIcon className="h-4 w-4 mr-2" />
          Edit Mode
        </>
      )}
    </Button>
  );
};

export default EditModeToggle;

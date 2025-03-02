import { useQuery, useQueryClient } from "@tanstack/react-query";

const useEditMode = () => {
  const queryClient = useQueryClient();

  const { data: editMode = false } = useQuery({
    queryKey: ["editMode"],
    queryFn: () => JSON.parse(localStorage.getItem("editMode") || "false"),
    initialData: false,
  });

  const setEditMode = (value: boolean) => {
    queryClient.setQueryData(["editMode"], value);
    localStorage.setItem("editMode", JSON.stringify(value));
  };

  return { editMode, setEditMode };
};

export default useEditMode;

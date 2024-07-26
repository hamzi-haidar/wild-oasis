import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUpdateCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useUpdateCabin() {
  const queryClient = useQueryClient();

  const { mutate: updateCabin, isLoading: isUpdating } = useMutation({
    mutationFn: ({ newCabinData, id }) => createUpdateCabin(newCabinData, id),

    onSuccess: () => {
      toast.success("Cabin successfully updated", { id: "update" });
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },

    onError: (err) => toast.error(err.message, { id: "update" }),

    onMutate: () => toast.loading("Updating cabin...", { id: "update" }),
  });

  return { updateCabin, isUpdating };
}

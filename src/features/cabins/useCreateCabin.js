import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUpdateCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useCreateCabin() {
  const queryClient = useQueryClient();

  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: createUpdateCabin,

    onSuccess: () => {
      toast.success("New cabin successfully created", { id: "add" });
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },

    onError: (err) => toast.error(err.message, { id: "add" }),

    onMutate: () => toast.loading("Adding cabin...", { id: "add" }),
  });

  return { createCabin, isCreating };
}

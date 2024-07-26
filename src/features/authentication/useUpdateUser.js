import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { updateCurrentUser } from "../../services/apiAuth";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: ({ password, fullName, avatar }) =>
      updateCurrentUser({ password, fullName, avatar }),

    onSuccess: () => {
      toast.success("user account successfully updated", { id: "update" });
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },

    onError: (err) => toast.error(err.message, { id: "update" }),

    onMutate: () => toast.loading("Updating user...", { id: "update" }),
  });

  return { updateUser, isUpdating };
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),

    onSuccess: (user) => {
      toast.success(
        `${user.user.user_metadata.fullName} Successfully logged in`,
        { id: 1 }
      );
      queryClient.setQueryData(["user"], user.user);

      navigate("/dashboard", { replace: true });
    },

    onError: () => {
      toast.error("Provided email or password are incorrect", { id: 1 });
    },

    onMutate: () => toast.loading("Logging in...", { id: 1 }),
  });

  return { login, isLoading };
}

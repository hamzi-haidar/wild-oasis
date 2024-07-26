import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out`, {
        id: 1,
      });

      queryClient.invalidateQueries({ active: true });
    },

    onError: () =>
      toast.error("there was an error while checking out", { id: 1 }),

    onMutate: () => toast.loading("Checking out...", { id: 1 }),
  });

  return { checkout, isCheckingOut };
}

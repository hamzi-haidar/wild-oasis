import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { mutate: deleteBooking, isLoading: isDeleting } = useMutation({
    mutationFn: (bookingId) => deleteBookingApi(bookingId),

    onSuccess: () => {
      toast.success(`Booking successfully deleted`, { id: 1 });

      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },

    onError: (err) => toast.error(err.message, { id: 1 }),

    onMutate: () => toast.loading("Deleting booking...", { id: 1 }),
  });

  return { deleteBooking, isDeleting };
}

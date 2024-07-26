import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking as createBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  // const navigate = useNavigate();

  const { mutate: createBooking, isLoading: isCreating } = useMutation({
    mutationFn: createBookingApi,
    mutationKey: ["bookings"],

    onSuccess: () => {
      toast.success("Booking successfully created", { id: 1 });
      queryClient.invalidateQueries("bookings");
    },

    onError: (err) => toast.error(err.message, { id: 1 }),

    onMutate: () => toast.loading("Creating booking", { id: 1 }),
  });
  return { createBooking, isCreating };
}

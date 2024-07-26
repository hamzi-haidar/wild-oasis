import { useQuery } from "@tanstack/react-query";
import { getCabinBookingsDates } from "../../services/apiBookings";

export function useCabinBookingsDates(id) {
  const { data: cabinBookingsDates, isLoading } = useQuery({
    queryFn: () => getCabinBookingsDates(id),
    queryKey: ["cabinBookingsDates"],
  });

  return { cabinBookingsDates, isLoading };
}

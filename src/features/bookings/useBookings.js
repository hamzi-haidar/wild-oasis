import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useLocation, useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const { pathname } = useLocation();

  //Filter
  const filterValue = searchParams.get("status");

  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  //filter by date range
  const filterDates = JSON.parse(searchParams.get("dates"));

  // Sort

  const sortByRow = searchParams.get("sortBy") || "startDate-desc";

  const [field, direction] = sortByRow.split("-");

  const sortBy = { field, direction };

  //Pagination
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  //search
  const search = searchParams.get("search");

  //Query
  const {
    isLoading,
    data: { data: bookings, count } = {},
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, search, filterDates?.end, page],
    queryFn: () =>
      getBookings({ filter, sortBy, page, search, filterDates, pathname }),
  });

  //Pre-fetching
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: [
        "bookings",
        filter,
        sortBy,
        search,
        filterDates?.end,
        page + 1,
      ],
      queryFn: () =>
        getBookings({
          filter,
          sortBy,
          search,
          filterDates,
          pathname,
          page: page + 1,
        }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: [
        "bookings",
        filter,
        sortBy,
        search,
        filterDates?.end,
        page - 1,
      ],
      queryFn: () =>
        getBookings({
          filter,
          sortBy,
          search,
          filterDates,
          pathname,
          page: page - 1,
        }),
    });

  return { bookings, isLoading, error, count };
}

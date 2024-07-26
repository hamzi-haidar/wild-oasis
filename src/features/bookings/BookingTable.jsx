import { useBookings } from "./useBookings";

import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import Pagination from "../../ui/Pagination";
import { useSearchParams } from "react-router-dom";
import { formatDate } from "date-fns";

function BookingTable() {
  const { bookings, isLoading, count } = useBookings();

  const [searchParams] = useSearchParams();

  const filterDates = JSON.parse(searchParams.get("dates"));

  if (isLoading) return <Spinner />;

  if (!bookings.length) return <Empty resourceName="bookings" />;

  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>
            Dates
            {filterDates?.start &&
              ` (${
                filterDates?.start &&
                formatDate(filterDates?.start, "MMM-dd-yyyy")
              }—${
                filterDates?.end
                  ? formatDate(filterDates?.end, "MMM-dd-yyyy")
                  : ""
              })`}
          </div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;

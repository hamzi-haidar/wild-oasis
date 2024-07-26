// import styled from "styled-components";

import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty";
import { useBookings } from "../bookings/useBookings";
import { formatISO } from "date-fns";

function CabinTable() {
  const { cabins, isLoading } = useCabins();
  const { bookings, isLoading: isLoading2 } = useBookings();

  const [searchParams] = useSearchParams();

  if (isLoading || isLoading2) return <Spinner />;

  if (!cabins.length) return <Empty resourceName="cabins" />;

  const filterValue = searchParams.get("discount") || "all";

  let filteredCabins;

  if (filterValue === "all") filteredCabins = cabins;

  if (filterValue === "no-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);

  if (filterValue === "with-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);

  const { start, end } = JSON.parse(searchParams.get("dates")) || {};

  if (end) {
    const unAvailableCabins = bookings
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .map((booking) => {
        return {
          start: booking.startDate,
          end: booking.endDate,
          cabin: booking.cabins.name,
        };
      })
      .filter(
        (t) =>
          (t.end >= formatISO(start) && t.end <= formatISO(end)) ||
          (t.start <= formatISO(end) && t.start >= formatISO(start)) ||
          (t.start <= formatISO(end) && t.end >= formatISO(end))
      )
      .map((cabin) => cabin.cabin);

    filteredCabins = filteredCabins.filter(
      (cabin) => !unAvailableCabins.includes(cabin.name)
    );
  }

  const sortBy = searchParams.get("sortBy") || "name-asc";

  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedCabins = filteredCabins.sort((a, b) =>
    typeof a[field] === "string"
      ? a[field].localeCompare(b[field]) * modifier
      : (a[field] - b[field]) * modifier
  );

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1.3fr 1fr">
        <Table.Header role="row">
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={sortedCabins}
          render={(cabin) => (
            <CabinRow
              cabin={cabin}
              key={cabin.id}
              filterDates={{ start, end }}
            />
          )}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;

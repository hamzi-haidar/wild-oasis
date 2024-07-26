import { useSearchParams } from "react-router-dom";
import DateFilter from "../../ui/DateFilter";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
import TableOperations from "../../ui/TableOperations";
import { format } from "date-fns";

function CabinsTableOperations() {
  const [searchParams] = useSearchParams();
  const { start, end } = JSON.parse(searchParams.get("dates")) || {};

  return (
    <TableOperations>
      {end && (
        <p>
          available ({format(start, "MMM dd yyyy")}-{format(end, "MMM dd yyyy")}
          )
        </p>
      )}
      <DateFilter />
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "All" },
          { value: "no-discount", label: "No discount" },
          { value: "with-discount", label: "With discount" },
        ]}
      />
      <SortBy
        options={[
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
          { value: "regularPrice-asc", label: "Sort by price (low first)" },
          { value: "regularPrice-desc", label: "Sort by price (high first)" },
          { value: "maxCapacity-asc", label: "Sort by Capacity (low first)" },
          { value: "maxCapacity-desc", label: "Sort by Capacity (high first)" },
        ]}
      />
    </TableOperations>
  );
}

export default CabinsTableOperations;

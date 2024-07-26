import { formatISO } from "date-fns";
import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

export async function getBookings({
  filter,
  sortBy,
  page,
  search,
  filterDates,
  pathname,
}) {
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at,startDate,endDate,numNights,numGuests,status,totalPrice, cabins(name), guests(fullName, email)",
      { count: "exact" }
    );

  if (pathname === "/bookings") {
    if (filterDates?.end)
      query = query
        .gte("startDate", filterDates.start)
        .lte("endDate", formatISO(new Date(filterDates.end)));

    if (search) {
      // this login is used because guests is foreign
      const { data: guestsData, error: guestsError } = await supabase
        .from("guests")
        .select("id")
        .ilike("fullName", `%${search}%`);

      if (guestsError) throw new Error("guests could not be loaded");

      const guestIds = guestsData.map((guest) => guest.id);

      query = query.in("guestId", guestIds);
    }

    if (filter)
      query = query[filter.method || "eq"](filter.field, filter.value);

    if (sortBy)
      query = query.order(sortBy.field, {
        ascending: sortBy.direction === "asc",
      });

    if (page) {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);
    }
  }

  const { data, error, count } = await query;

  if (error) {
    console.log(error);
    throw new Error("Bookings could not be loaded");
  }

  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}
export async function createBooking({ newBooking, newGuest }) {
  const { data: guest, error: guestError } = await supabase
    .from("guests")
    .insert([newGuest])
    .select()
    .single();

  if (guestError) {
    console.error(guestError);
    throw new Error("Couldn't create Booking guest");
  }

  const guestId = guest.id;

  const { data, error } = await supabase
    .from("bookings")
    .insert([{ ...newBooking, guestId }]);

  if (error) {
    await supabase.from("guests").delete().eq("id", guestId).single();

    console.error(error);
    throw new Error("Couldn't create Booking guest");
  }

  return data;
}

// Returns all BOOKINGS that are created after the given date. Useful to get bookings created in the last 30 days, for example.
// the date needs to be an ISO string
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}
export async function getCabinBookingsDates(id) {
  const { data: currentCabin, error: errorCabin } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  if (errorCabin) {
    console.error(errorCabin);
    throw new Error("Cabins could not be loaded");
  }

  const { data: bookingsDates, error } = await supabase
    .from("bookings")
    .select("start:startDate, end:endDate")
    .eq("cabinId", id)
    .neq("status", "checked-out");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return { bookingsDates, currentCabin };
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

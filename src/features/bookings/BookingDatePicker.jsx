import {
  addDays,
  addMonths,
  differenceInDays,
  eachDayOfInterval,
  subDays,
} from "date-fns";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import styled from "styled-components";

const StyledDatePicker = styled.div`
  align-items: center;
  justify-content: center;
  scale: 1.7;
  height: 21rem;
  flex-direction: column;
  margin: 7.5rem 6rem 1rem 6rem;
  font-family: inherit;
  line-height: 2rem;
  box-shadow: 12px 0px 20px -20px black;

  background-color: var(--color-grey-50);
  border: 3px solid var(--color-grey-200);
`;

const Error = styled.div`
  position: absolute;
  bottom: 7.7rem;
  left: 28rem;
  white-space: nowrap;
  color: var(--color-red-700);
  font-size: 1.8rem;
  font-weight: 500;
`;

function BookingDatePicker({
  dateRange,
  setDateRange,
  settings,
  bookingsDates,
}) {
  const [startDate, endDate] = dateRange;

  const nextStart = startDate
    ? bookingsDates.filter((dates) => new Date(dates.end) > startDate)[0]?.start
    : "";

  //logic to calculating number of days between booking end and the next booking start so we could check if its less then or equal the min booking nights so we make those dates unavailable in the date picker
  const filteredEmptyDays = bookingsDates
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .map((endStart, i) => {
      if (i === 0)
        return {
          start: subDays(new Date(), 1),
          end: endStart.start,
        };

      return {
        start: bookingsDates[i - 1].end,
        end: endStart.start,
      };
    })
    .filter(
      (endStart) =>
        differenceInDays(endStart.end, endStart.start) <=
        +settings.minBookingLength + 1
    );

  return (
    <DatePicker
      todayButton={"Start from today"}
      selectsRange={true}
      calendarContainer={StyledDatePicker}
      startDate={startDate}
      endDate={endDate}
      inline
      fixedHeight
      minDate={startDate ? new Date(startDate) : new Date()}
      maxDate={
        startDate
          ? addDays(startDate, settings.maxBookingLength)
          : addMonths(new Date(), 24)
      }
      onChange={(update) => {
        if (
          update[1] &&
          update[1] < addDays(update[0], settings.minBookingLength)
        ) {
          toast(
            <Error>
              {settings.minBookingLength} nights min pick another date
            </Error>,
            {
              id: "date-error",
              position: "bottom-left",
              style: { background: "none" },
            }
          );

          return;
        }

        toast.remove("date-error");
        setDateRange(update);
      }}
      excludeDateIntervals={
        !startDate || endDate
          ? [...bookingsDates, ...filteredEmptyDays]
          : [
              {
                start: subDays(new Date(), 1000),
                end: subDays(new Date(startDate), 1),
              },
              {
                start:
                  nextStart ||
                  addDays(new Date(startDate), settings.maxBookingLength + 1),
                end: addDays(new Date(), 1000),
              },
            ]
      }
      highlightDates={
        startDate && !endDate
          ? eachDayOfInterval({
              start: new Date(startDate),
              end: addDays(new Date(startDate), settings.minBookingLength - 1),
            })
          : []
      }
    />
  );
}

export default BookingDatePicker;

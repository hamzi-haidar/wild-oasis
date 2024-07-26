import { useState } from "react";
import DatePicker from "react-datepicker";
import { useLocation, useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";
import { HiOutlineCalendar } from "react-icons/hi2";
import { addDays, addMonths, eachDayOfInterval, subDays } from "date-fns";
import { useSettings } from "../features/settings/useSettings";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledDatePicker = styled.div`
  position: absolute;
  z-index: 2;
  scale: 1.5;
  left: -9px;
  top: 10rem;
  font-family: inherit;
  background-color: var(--color-grey-50);
  border: 3px solid var(--color-grey-200);
  box-shadow: var(--shadow-lg);
`;

const DateInput = styled.div`
  position: relative;
`;

const DatePickerButton = styled.button`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  color: var(--color-grey-600);
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  text-align: center;
  white-space: nowrap;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  font-size: 1.4rem;
  padding: 1.2rem 1.6rem;
  font-weight: 500;
  width: 16rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  ${(props) =>
    props.active &&
    css`
      color: var(--color-brand-50);
      background-color: var(--color-brand-600);

      &:hover {
        background-color: var(--color-brand-700);
      }
    `}
`;

function DateFilter() {
  const { settings, isLoading } = useSettings();

  const [searchParams, setSearchParams] = useSearchParams();

  const [startDate, setStartDate] = useState(
    JSON.parse(searchParams.get("dates"))?.start || null
  );
  const [endDate, setEndDate] = useState(
    JSON.parse(searchParams.get("dates"))?.end || null
  );
  const [isOpen, setIsOpen] = useState(false);

  const { pathname } = useLocation();

  const ref = useOutsideClick((e) => {
    if (e.target.classList.value.includes("datepicker")) return;
    setStartDate(null);
    setEndDate(null);
    setIsOpen(false);
  });

  if (isLoading) return <SpinnerMini />;

  return (
    <DateInput>
      <DatePickerButton
        active={startDate !== null}
        variation="secondary"
        onClick={(e) => {
          e.stopPropagation();
          if (startDate) {
            setStartDate(null);
            setEndDate(null);
            searchParams.delete("dates");
            setSearchParams(searchParams);
            setIsOpen(endDate === null);
            return;
          }

          setIsOpen(!isOpen);
        }}
      >
        <HiOutlineCalendar />{" "}
        {startDate ? <span>Clear dates</span> : <span>Filter by dates</span>}
      </DatePickerButton>
      {isOpen && (
        <div ref={ref}>
          <DatePicker
            minDate={
              startDate
                ? new Date(startDate)
                : pathname === "/cabins"
                ? new Date()
                : new Date("2022-03-25")
            }
            maxDate={
              startDate && pathname === "/cabins"
                ? addDays(startDate, settings.maxBookingLength)
                : addMonths(new Date(), 24)
            }
            inline
            fixedHeight
            calendarContainer={StyledDatePicker}
            selectsRange={true}
            todayButton={"start from today"}
            startDate={startDate}
            endDate={endDate}
            excludeDateIntervals={
              startDate && [
                {
                  start: subDays(new Date(startDate), 1000),
                  end: subDays(new Date(startDate), 1),
                },
                pathname === "/cabins" && {
                  start: addDays(
                    new Date(startDate),
                    settings.maxBookingLength + 1
                  ),
                  end: addDays(new Date(), 1000),
                },
              ]
            }
            onChange={(dates) => {
              const [start, end] = dates;
              if (
                pathname === "/cabins" &&
                end &&
                end < addDays(start, settings.minBookingLength)
              ) {
                toast.error(
                  `${settings.minBookingLength} nights min pick another date`
                );

                return;
              }
              toast.dismiss();

              setStartDate(start);
              setEndDate(end);

              if (end) {
                searchParams.set("dates", JSON.stringify({ start, end }));
                setSearchParams(searchParams);
                setIsOpen(false);

                if (searchParams.get("page")) {
                  searchParams.set("page", 1);
                  setSearchParams(searchParams);
                }
              }
            }}
            highlightDates={
              startDate && !endDate && pathname === "/cabins"
                ? eachDayOfInterval({
                    start: new Date(startDate),
                    end: addDays(
                      new Date(startDate),
                      settings.minBookingLength - 1
                    ),
                  })
                : []
            }
          />
        </div>
      )}
    </DateInput>
  );
}

export default DateFilter;

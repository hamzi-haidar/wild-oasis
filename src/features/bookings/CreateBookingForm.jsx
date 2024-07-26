import { useState } from "react";
import styled from "styled-components";

import { differenceInCalendarDays, formatISO } from "date-fns";
import CountryData from "country-data";

import { useSettings } from "../settings/useSettings";
import { useCreateBooking } from "./useCreateBooking";
import { useForm } from "react-hook-form";

import { formatCurrency } from "../../utils/helpers";
import { countries } from "../../data/data-countries";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import TextArea from "../../ui/TextArea";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";
import Select from "../../ui/Select";
import toast from "react-hot-toast";
import BookingDatePicker from "./BookingDatePicker";
import CreateBookingFooter from "./CreateBookingFooter";
import { useSearchParams } from "react-router-dom";

const StyledCreateBookingForm = styled.div`
  display: flex;
  align-items: start;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
`;

const StyledFormContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 36rem;

  background-color: var(--color-grey-0);

  & form {
    overflow-y: scroll;
  }
`;

const Error = styled.div`
  position: absolute;
  bottom: 11rem;
  right: 5rem;
  white-space: nowrap;
  color: var(--color-red-700);
  font-size: 1.8rem;
  font-weight: 500;
`;

function CreateBookingForm({ bookingsDates, currentCabin }) {
  //this is used to rerender the component when numGuests is changed since its not a state and we need to update total price when its changed
  const [renderToggle, setRenderToggle] = useState(false);
  const [hasBreakfast, setHasBreakfast] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [SearchParams] = useSearchParams();
  const { start, end } = JSON.parse(SearchParams.get("dates")) || "";
  const [dateRange, setDateRange] = useState([start || null, end || null]);

  const [startDate, endDate] = dateRange;

  const { settings, isLoading } = useSettings();
  const { createBooking } = useCreateBooking();

  const { register, getValues, reset, handleSubmit, formState } = useForm();
  const { errors } = formState;

  const numGuests = getValues().numGuests;

  if (isLoading) return <Spinner />;

  const { maxGuestsPerBooking, breakfastPrice } = settings;

  const numNights =
    startDate && endDate
      ? differenceInCalendarDays(new Date(endDate), new Date(startDate))
      : 1;

  const extrasPrice = hasBreakfast
    ? breakfastPrice * +numGuests * (numNights || 1)
    : 0;

  const maxNumGuests =
    maxGuestsPerBooking > currentCabin.maxCapacity
      ? currentCabin.maxCapacity
      : maxGuestsPerBooking;

  const cabinPrice =
    startDate && endDate
      ? currentCabin.regularPrice * +numNights
      : currentCabin.regularPrice;

  const totalPrice = cabinPrice + extrasPrice;

  function onSubmit(data) {
    if (!endDate) {
      toast(<Error> Please choose date first</Error>, {
        id: "date-error",
        position: "bottom-right",
        style: { background: "none" },
      });

      return;
    }

    const {
      email,
      fullName,
      nationalID,
      countryCode,
      numGuests,
      observations,
    } = data;

    const country = CountryData.countries[countryCode];

    const nationality = country.name;

    const countryFlag = `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;

    const newGuest = { fullName, email, nationalID, nationality, countryFlag };

    const newBooking = {
      startDate: formatISO(new Date(startDate)),
      endDate: formatISO(new Date(endDate)),
      numNights,
      numGuests,
      cabinPrice,
      extrasPrice,
      totalPrice,
      status: "unconfirmed",
      hasBreakfast,
      isPaid,
      observations,
      cabinId: currentCabin.id,
    };

    createBooking({ newBooking, newGuest });
    setDateRange([null, null]);
    reset();
    setHasBreakfast(false);
    setIsPaid(false);
  }

  function handleCancel() {
    reset();
    setDateRange([null, null]);
    setHasBreakfast(false);
    setIsPaid(false);
  }

  return (
    <StyledCreateBookingForm>
      <StyledFormContainer>
        <BookingDatePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
          settings={settings}
          bookingsDates={bookingsDates}
        />
        <Form>
          <FormRow label="full name" error={errors?.fullName?.message}>
            <Input
              type="text"
              id="fullName"
              {...register("fullName", { required: "This field is reguired" })}
            />
          </FormRow>
          <FormRow label="email" error={errors?.email?.message}>
            <Input
              type="email"
              id="email"
              {...register("email", {
                required: "This field is reguired",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please provide a valid email address",
                },
              })}
            />
          </FormRow>
          <FormRow label="national id" error={errors?.nationalID?.message}>
            <Input
              type="text"
              id="nationalID"
              {...register("nationalID", {
                required: "This field is reguired",
              })}
            />
          </FormRow>
          <FormRow label="nationality" error={errors?.countryCode?.message}>
            <Select
              options={countries}
              type="form"
              {...register("countryCode", {
                required: "this field is required",
              })}
            />
          </FormRow>
          <FormRow
            label={`Number of guests (max ${maxNumGuests})`}
            error={errors?.numGuests?.message}
          >
            <Input
              type="number"
              id="numGuests"
              onWheel={(e) => e.target.blur()}
              defaultValue={1}
              min={1}
              max={maxNumGuests}
              {...register("numGuests", {
                required: "this field is required",
                min: {
                  value: 1,
                  message: "Can't be less then 1",
                },
                max: {
                  value: maxNumGuests,
                  message:
                    settings.maxGuestsPerBooking > currentCabin.maxCapacity
                      ? `Cabin only fits ${maxNumGuests} guests`
                      : `Max allowed at this moment is ${maxNumGuests}`,
                },
                onChange: () => {
                  setRenderToggle(!renderToggle);
                },
              })}
            />
          </FormRow>

          <FormRow label="Observations">
            <TextArea
              type="number"
              id="observations"
              {...register("observations")}
            />
          </FormRow>

          <FormRow
            label={`Add Breakfast ${formatCurrency(
              settings.breakfastPrice
            )} per night`}
          >
            <Checkbox
              checked={hasBreakfast}
              id="hasBreakfast"
              onChange={() => setHasBreakfast(!hasBreakfast)}
            >
              {hasBreakfast
                ? `Total ${formatCurrency(extrasPrice)}`
                : "Breakfast not included"}
            </Checkbox>
          </FormRow>
          <FormRow label="Confirm Paid">
            <Checkbox
              Checked={isPaid}
              id="isPaid"
              onChange={() => setIsPaid(!isPaid)}
            >
              {isPaid ? "Paid for this booking" : "Paying later"}
            </Checkbox>
          </FormRow>
        </Form>
      </StyledFormContainer>
      <CreateBookingFooter
        settings={settings}
        dateRange={dateRange}
        setDateRange={setDateRange}
        totalPrice={totalPrice}
        numNights={numNights}
        hasBreakfast={hasBreakfast}
        handleSubmit={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        numGuests={numGuests}
      />
    </StyledCreateBookingForm>
  );
}

export default CreateBookingForm;

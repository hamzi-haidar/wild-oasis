import styled from "styled-components";
import { formatCurrency } from "../../utils/helpers";
import { format } from "date-fns";
import Button from "../../ui/Button";
import ButtonGroup from "../../ui/ButtonGroup";

const Footer = styled.div`
  display: flex;
  font-size: 1.8rem;
  width: 100%;
  height: 10px;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;

  & span {
    font-size: 2rem;
    font-weight: 700;
  }
`;

const FooterBookingInfo = styled.div`
  display: flex;
  background-color: var(--color-green-100);
  padding: 7px;
  border-radius: 5px;

  & span {
    font-size: 1.6rem;
    font-weight: 500;
    letter-spacing: 1.2px;
  }
`;

const FooterDateBox = styled.div`
  display: flex;
  gap: 1rem;
`;

function CreateBookingFooter({
  dateRange,
  setDateRange,
  totalPrice,
  numNights,
  hasBreakfast,
  handleSubmit,
  onCancel,
  numGuests,
  settings,
}) {
  const [startDate, endDate] = dateRange;

  const { minBookingLength, maxBookingLength } = settings;

  return (
    <Footer>
      <FooterDateBox>
        <div>
          {startDate ? (
            <span>
              {" "}
              <span>{startDate ? format(startDate, "MMM-dd-yyyy") : ""} </span>
              &mdash;
              <span>
                {" "}
                {endDate
                  ? format(endDate, "MMM-dd-yyyy")
                  : "Departure date"}{" "}
              </span>
            </span>
          ) : (
            <>
              Booking date <span>{minBookingLength} nights </span>
              min - <span>{maxBookingLength} nights </span>max
            </>
          )}
        </div>
        {startDate && (
          <Button size="small" onClick={() => setDateRange([null, null])}>
            Clear Date
          </Button>
        )}
      </FooterDateBox>

      <FooterBookingInfo>
        {`Total ${formatCurrency(totalPrice)}  ${
          endDate
            ? ` for ${numNights} night${numNights > 1 ? "s" : ""} `
            : ` per night`
        }  ${hasBreakfast ? "with breakfast" : "without breakfast"} for ${
          numGuests || 1
        } ${numGuests > 1 ? "people" : "person"}`}
      </FooterBookingInfo>

      <ButtonGroup>
        <Button variation="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Book cabin</Button>
      </ButtonGroup>
    </Footer>
  );
}

export default CreateBookingFooter;

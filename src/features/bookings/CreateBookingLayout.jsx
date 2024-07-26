import styled from "styled-components";
import CreateBookingForm from "./CreateBookingForm";
import CreateBookingDetails from "./CreateBookingDetails";

import { useCabinBookingsDates } from "./usecabinBookingsDates";
import { useParams } from "react-router-dom";
import Spinner from "../../ui/Spinner";

const StyledCreateBookingLayout = styled.div`
  display: flex;
  align-items: start;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
`;

function CreateBookingLayout() {
  const { cabinId } = useParams();

  const { cabinBookingsDates, isLoading } = useCabinBookingsDates(cabinId);

  if (isLoading) return <Spinner />;

  const { bookingsDates, currentCabin } = cabinBookingsDates || {};

  return (
    <StyledCreateBookingLayout>
      <CreateBookingDetails currentCabin={currentCabin} />
      <CreateBookingForm
        bookingsDates={bookingsDates}
        currentCabin={currentCabin}
      />
    </StyledCreateBookingLayout>
  );
}

export default CreateBookingLayout;

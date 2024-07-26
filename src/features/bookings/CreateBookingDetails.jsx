import styled from "styled-components";
import Table from "../../ui/Table";
import { formatCurrency } from "../../utils/helpers";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";

const StyledCabin = styled.div`
  display: flex;

  gap: 1rem;
  align-items: center;
  width: 100%;
`;

const ImageBox = styled.div`
  display: flex;
  width: 20rem;
  height: 13rem;
  background-color: var(--color-grey-0);
  border: 3px solid var(--color-grey-200);
  border-radius: 10px;

  & img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: fill;
  }
`;

function CreateBookingDetails({ currentCabin }) {
  const navigate = useNavigate();

  return (
    <StyledCabin>
      <ImageBox>
        <img src={currentCabin.image} alt="Cabin" />
      </ImageBox>
      <div>
        <Table columns="17rem 17rem 17rem 17rem 15rem">
          <Table.Header role="row">
            <div>cabin</div>
            <div>price</div>
            <div>discount</div>
            <div>capacity</div>
            <div></div>
          </Table.Header>
          <Table.Row>
            <p>{currentCabin.name}</p>
            <p>{formatCurrency(currentCabin.regularPrice)}</p>
            <p>
              {+currentCabin.discount > 0
                ? formatCurrency(currentCabin.discount)
                : "—"}
            </p>
            <p>Fits up to {currentCabin.maxCapacity} guests</p>
            <Button onClick={() => navigate(-1)}>{`Change cabin`}</Button>
          </Table.Row>
        </Table>
      </div>
    </StyledCabin>
  );
}

export default CreateBookingDetails;

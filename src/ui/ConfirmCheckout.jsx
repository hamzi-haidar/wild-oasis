import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";

const StyledConfirmDelete = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

function ConfirmCheckout({ resourceName, onConfirm, disabled, onCloseModal }) {
  return (
    <StyledConfirmDelete>
      <Heading as="h3">check out {resourceName}</Heading>
      <p>
        Are you sure you want to check out this {resourceName}. This action
        cannot be undone.
      </p>

      <div>
        <Button
          onClick={() => onCloseModal?.()}
          variation="secondary"
          disabled={disabled}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onCloseModal?.();
            onConfirm();
          }}
          variation="checkOut"
          disabled={disabled}
        >
          Check out
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmCheckout;

import Button from "../../ui/Button";
import ConfirmCheckout from "../../ui/ConfirmCheckout";
import Modal from "../../ui/Modal";
import { useCheckout } from "./useCheckout";

function CheckoutButton({ bookingId }) {
  const { checkout, isCheckingOut } = useCheckout();

  return (
    <Modal>
      <Modal.Open opens="check-out">
        <Button variation="checkOut" size="small">
          Check out
        </Button>
      </Modal.Open>
      <Modal.Window name="check-out">
        <ConfirmCheckout
          resourceName="booking"
          onConfirm={() => checkout(bookingId)}
          disabled={isCheckingOut}
        />
      </Modal.Window>
    </Modal>
  );
}

export default CheckoutButton;

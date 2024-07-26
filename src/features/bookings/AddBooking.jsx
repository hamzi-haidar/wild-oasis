import { Link } from "react-router-dom";
import Button from "../../ui/Button";

function AddBooking() {
  return (
    <div>
      <Button as={Link} to="/cabins">
        Add new Booking
      </Button>
    </div>
  );
}

export default AddBooking;

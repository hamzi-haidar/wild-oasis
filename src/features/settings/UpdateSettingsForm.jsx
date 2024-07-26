import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { useSettings } from "./useSettings";
import { useUpdateSetting } from "./useUpdateSettings";

function UpdateSettingsForm() {
  const {
    isLoading,
    settings: {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    } = {},
  } = useSettings();

  const { isUpdating, updateSetting } = useUpdateSetting();

  function handleUpdate(e, field, isChanged) {
    const { value } = e.target;

    if (!value || !isChanged) return;

    updateSetting({ [field]: value });
  }

  if (isLoading) return <Spinner />;

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          min={1}
          defaultValue={minBookingLength}
          disabled={isUpdating}
          onBlur={(e) =>
            handleUpdate(
              e,
              "minBookingLength",
              minBookingLength !== +e.target.value
            )
          }
        />
      </FormRow>

      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          min={1}
          defaultValue={maxBookingLength}
          disabled={isUpdating}
          onBlur={(e) =>
            handleUpdate(
              e,
              "maxBookingLength",
              maxBookingLength !== +e.target.value
            )
          }
        />
      </FormRow>

      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          defaultValue={maxGuestsPerBooking}
          disabled={isUpdating}
          onBlur={(e) =>
            handleUpdate(
              e,
              "maxGuestsPerBooking",
              maxGuestsPerBooking !== +e.target.value
            )
          }
        />
      </FormRow>

      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={breakfastPrice}
          disabled={isUpdating}
          onBlur={(e) =>
            handleUpdate(
              e,
              "breakfastPrice",
              breakfastPrice !== +e.target.value
            )
          }
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;

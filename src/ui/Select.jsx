import React from "react";
import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  ${(props) => props.type === "form" && `width: 100%`};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);

  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

// we are using React.forwardRef so that the useForm Register works for a select field component
const Select = React.forwardRef(
  ({ options, value, onChange, ...props }, ref) => {
    return (
      <StyledSelect ref={ref} value={value} onChange={onChange} {...props}>
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
    );
  }
);

export default Select;

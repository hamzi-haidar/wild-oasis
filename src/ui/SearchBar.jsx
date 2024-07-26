import { useSearchParams } from "react-router-dom";

import styled from "styled-components";

const StyledSearchBar = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  padding: 0.8rem 1.2rem;
  width: 15rem;
`;

function SearchBar({ label }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchValue = searchParams.get("search");

  return (
    <StyledSearchBar
      label={label}
      type="search"
      value={searchValue || ""}
      placeholder="search name"
      onChange={(e) => {
        searchParams.set("search", e.target.value);
        setSearchParams(searchParams);
        if (searchParams.get("page")) searchParams.set("page", 1);
        setSearchParams(searchParams);
        if (searchParams.get("status")) searchParams.set("status", "all");
        setSearchParams(searchParams);
      }}
    ></StyledSearchBar>
  );
}

export default SearchBar;

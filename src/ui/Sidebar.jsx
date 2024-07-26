import styled from "styled-components";
import MainNav from "./MainNav";
import Logo from "./Logo";
// import Uploader from "../data/Uploader";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);
  grid-row: 1/-1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

function Sidebar() {
  return (
    <StyledSidebar>
      <Logo />
      <MainNav />
      {/*the uploader is used to upload default data to work on in the website please  uncomment it here and in the imports to use it*/}
      {/* <Uploader /> */}
    </StyledSidebar>
  );
}

export default Sidebar;

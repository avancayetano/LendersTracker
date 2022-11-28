import { MdOutlineManageSearch } from "react-icons/md";

import BasePage from "./BasePage";

function SearchPage() {
  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4 className="icon-cont icon-cont-center">
          <MdOutlineManageSearch />
          <span className="margin-left text-overflow">Search</span>
        </h4>
      </div>
    </BasePage>
  );
}

export default SearchPage;

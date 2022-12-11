import { useState, useEffect } from "react";
import { MdOutlineManageSearch, MdOutlineTableRows } from "react-icons/md";

import BasePage from "./BasePage";
import Table from "../components/Table";

function OthersTransactionsPage() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("/api/get-others-transactions-table")
      .then((res) => res.json())
      .then((data) => setTableData([...data.message]));
  }, []);

  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4 className="icon-cont icon-cont-center">
          <MdOutlineManageSearch />
          <span className="margin-left text-overflow">
            Others' Transactions
          </span>
        </h4>
        {tableData.length > 0 && (
          <Table
            icon={MdOutlineTableRows}
            title="Balance Amortization List"
            data={tableData}
            keys={[
              "lender",
              "loanId",
              "debtor",
              "amortizationPerWithdrawal",
              "balanceAmortization",
              "paymentDate",
            ]}
            color="w3-blue"
          />
        )}
      </div>
    </BasePage>
  );
}

export default OthersTransactionsPage;

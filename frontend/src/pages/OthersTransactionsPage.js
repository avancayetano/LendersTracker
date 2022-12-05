import { MdOutlineManageSearch, MdOutlineTableRows } from "react-icons/md";

import BasePage from "./BasePage";
import Table from "../components/Table";

function OthersTransactionsPage() {
  const tableData = [
    {
      loanId: 1,
      lender: "Lender 1",
      debtor: "Debtor 1",
      amortizationPerWithdrawal: 5000,
      balanceAmortization: 10000,
      receiptDate: "18-11-2022",
    },
    {
      loanId: 2,
      lender: "Lender 1",
      debtor: "Debtor 2",
      amortizationPerWithdrawal: 25000,
      balanceAmortization: 110000,
      receiptDate: "18-11-2022",
    },
    {
      loanId: 3,
      lender: "Lender 3",
      debtor: "Debtor 3",
      amortizationPerWithdrawal: 15000,
      balanceAmortization: 120000,
      receiptDate: "18-11-2022",
    },
    {
      loanId: 4,
      lender: "Lender 2",
      debtor: "Debtor 4",
      amortizationPerWithdrawal: 35000,
      balanceAmortization: 130000,
      receiptDate: "18-11-2022",
    },
  ];

  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4 className="icon-cont icon-cont-center">
          <MdOutlineManageSearch />
          <span className="margin-left text-overflow">
            Others' Transactions
          </span>
        </h4>
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
            "receiptDate",
          ]}
          headers={[
            "lender",
            "loanId",
            "debtor",
            "amortizationPerWithdrawal",
            "balanceAmortization",
            "receiptDateAlt",
          ]}
        />
      </div>
    </BasePage>
  );
}

export default OthersTransactionsPage;

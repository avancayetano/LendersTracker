import { Link } from "react-router-dom";

import LoanSummaryCard from "../components/LoanSummaryCard";
import BasePage from "./BasePage";

function LoanTransactionsPage() {
  const loanTransactions = [
    {
      loanId: 1,
      status: "Ongoing",
      debtor: "Debtor1",
      principalAmount: 10000,
      interest: 0.1,
      period: 6,
      withdrawalsPerMonth: 2,
      amortizationPerWithdrawal: 1333.33,
      amountAtEnd: 16000,
      completedAmortization: 5333.33,
      balanceAmortization: 10666.67,
      dateOfTransfer: "6 Oct 2022",
      proofOfTransfer: "url",
      lenderWhoTransferred: "Lender1",
      startPeriod: "15 Oct 2022",
      endPeriod: "30 Mar 2023",
      suretyDebtor: "Debtor123",
      contractSigned: "url",
      ackReceipts: "url",
      otherDocs: "url",
    },
    {
      loanId: 2,
      status: "Ongoing",
      debtor: "Debtor2",
      principalAmount: 10000,
      interest: 0.1,
      period: 6,
      withdrawalsPerMonth: 2,
      amortizationPerWithdrawal: 1333.33,
      amountAtEnd: 16000,
      completedAmortization: 5333.33,
      balanceAmortization: 10666.67,
      dateOfTransfer: "6 Oct 2022",
      proofOfTransfer: "url",
      lenderWhoTransferred: "Lender1",
      startPeriod: "15 Oct 2022",
      endPeriod: "30 Mar 2023",
      suretyDebtor: "Debtor123",
      contractSigned: "url",
      ackReceipts: "url",
      otherDocs: "url",
    },
  ];

  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4>Loan Transactions</h4>
        <h6>{"(Dummy data) Click either."}</h6>
        {loanTransactions.map((obj, idx) => (
          <Link to={"/dashboard/transactions/" + obj.loanId} key={obj.loanId}>
            <LoanSummaryCard data={obj} clickable={true} columns={4} />
          </Link>
        ))}
      </div>
    </BasePage>
  );
}

export default LoanTransactionsPage;

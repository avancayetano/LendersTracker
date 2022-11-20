import { useParams } from "react-router-dom";
import LoanSummaryCard from "../components/LoanSummaryCard";

import BasePage from "./BasePage";

function LoanDetailsPage() {
  const params = useParams();
  const loanId = parseInt(params.loanId);

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

  const loanDetails = loanTransactions.filter(
    (obj, idx) => obj.loanId == loanId
  )[0];

  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4>Loan {loanId} - Details </h4>
        <LoanSummaryCard data={loanDetails} />
        <h4>Lender breakdown table here... </h4>
        <h4>Payment table here... </h4>
      </div>
    </BasePage>
  );
}

export default LoanDetailsPage;

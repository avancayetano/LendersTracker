import { useParams } from "react-router-dom";
import { MdOutlineSubject, MdPeopleOutline } from "react-icons/md";

import LoanSummaryCard from "../components/LoanSummaryCard";
import LenderBreakdownTable from "../components/LenderBreakdownTable";
import BasePage from "./BasePage";
import PaymentTable from "../components/PaymentTable";
import BreakdownChart from "../components/BreakdownChart";
import Table from "../components/Table";

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
    (obj, idx) => obj.loanId === loanId
  )[0];

  const lenderBreakdown = [
    {
      lender: "Lender1",
      contribution: 10000,
      amortizationPerWithdrawal: 500,
      amountAtEnd: 6000,
      completedAmortization: 2000,
      balanceAmortization: 4000,
    },
    {
      lender: "Lender2",
      contribution: 123123,
      amortizationPerWithdrawal: 500,
      amountAtEnd: 6000,
      completedAmortization: 2000,
      balanceAmortization: 4000,
    },
  ];

  const payments = [
    {
      period: 1,
      receiptDate: "15 Oct 2022",
      amortization: 1000,
      status: [
        { lender: "Lender 1", received: true },
        { lender: "Lender 2", received: true },
      ],
    },
    {
      period: 1,
      receiptDate: "30 Oct 2022",
      amortization: 1000,
      status: [
        { lender: "Lender 1", received: true },
        { lender: "Lender 2", received: true },
      ],
    },
    {
      period: 2,
      receiptDate: "15 Oct 2022",
      amortization: 1000,
      status: [
        { lender: "Lender 1", received: true },
        { lender: "Lender 2", received: false },
      ],
    },
    {
      period: 2,
      receiptDate: "15 Oct 2022",
      amortization: 1000,
      status: [
        { lender: "Lender 1", received: false },
        { lender: "Lender 2", received: false },
      ],
    },
    {
      period: 3,
      receiptDate: "15 Oct 2022",
      amortization: 1000,
      status: [
        { lender: "Lender 1", received: false },
        { lender: "Lender 2", received: false },
      ],
    },
    {
      period: 3,
      receiptDate: "15 Oct 2022",
      amortization: 1000,
      status: [
        { lender: "Lender 1", received: false },
        { lender: "Lender 2", received: false },
      ],
    },
  ];

  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4 className="icon-cont icon-cont-center">
          <MdOutlineSubject />
          <span className="margin-left text-overflow">
            Loan {loanId} - Details
          </span>
        </h4>
        <div className="w3-row">
          <LoanSummaryCard data={loanDetails} clickable={false} columns={4} />
        </div>
        <div className="w3-row">
          <span className="w3-mobile w3-col s8 m9 l10">
            <Table
              icon={MdPeopleOutline}
              title="Lender Breakdown"
              data={lenderBreakdown}
              keys={[
                "lender",
                "contribution",
                "amortizationPerWithdrawal",
                "amountAtEnd",
                "completedAmortization",
                "balanceAmortization",
              ]}
            />
          </span>
          <span className="w3-mobile w3-col s4 m3 l2">
            <BreakdownChart
              breakdown={lenderBreakdown.map((obj) => {
                return { label: obj.lender, value: obj.contribution };
              })}
              label=""
              title="Cumulative Balance Amortization Breakdown"
            />
          </span>
        </div>

        <div className="w3-row">
          <PaymentTable data={payments} />
        </div>
      </div>
    </BasePage>
  );
}

export default LoanDetailsPage;

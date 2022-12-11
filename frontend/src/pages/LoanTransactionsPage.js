import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdOutlineAttachMoney, MdOutlineViewStream } from "react-icons/md";

import LoanSummaryCard from "../components/LoanSummaryCard";
import BasePage from "./BasePage";

function LoanTransactionsPage() {
  const [loanTransactions, setLoanTransactions] = useState([]);

  useEffect(() => {
    fetch("/api/get-user-loan-transactions")
      .then((res) => res.json())
      .then((data) => {
        setLoanTransactions([...data.message]);
      });
  }, []);

  const colors = [
    "w3-purple",
    "w3-deep-purple",
    "w3-indigo",
    "w3-blue",
    "w3-light-blue",
    "w3-cyan",
    "w3-teal",
    "w3-green",
  ];

  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4 className="icon-cont icon-cont-center">
          <MdOutlineViewStream />
          <span className="margin-left text-overflow">Loan Transactions</span>
        </h4>
        <h6>Click for more details.</h6>
        {loanTransactions.length === 0 && <h6>{"No loan transactions."}</h6>}
        {loanTransactions.map((obj, idx) => (
          <Link to={"/dashboard/transactions/" + obj.loanId} key={obj.loanId}>
            <LoanSummaryCard
              data={obj}
              clickable={true}
              columns={4}
              color={colors[idx % colors.length]}
            />
          </Link>
        ))}
      </div>
    </BasePage>
  );
}

export default LoanTransactionsPage;

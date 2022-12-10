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

  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4 className="icon-cont icon-cont-center">
          <MdOutlineViewStream />
          <span className="margin-left text-overflow">Loan Transactions</span>
        </h4>
        {loanTransactions.length === 0 && <h6>{"No loan transactions."}</h6>}
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

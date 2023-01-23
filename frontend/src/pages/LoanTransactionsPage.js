import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineAttachMoney, MdOutlineViewStream } from "react-icons/md";

import LoanSummaryCard from "../components/LoanSummaryCard";
import BasePage from "./BasePage";
import UserAuthContext from "../context/user-auth-context";
import AppMetaContext from "../context/app-meta-context";

function LoanTransactionsPage() {
  const [loanTransactions, setLoanTransactions] = useState([]);

  const userAuthContext = useContext(UserAuthContext);
  const appMetaContext = useContext(AppMetaContext);
  const navigate = useNavigate();

  const fetchData = () => {
    fetch(`/api/get-${userAuthContext.userType}-loan-transactions/`)
      .then((res) => res.json())
      .then((data) => {
        setLoanTransactions([...data.message]);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (appMetaContext.addedNewLoan) {
      appMetaContext.setAddedNewLoan(false);
      fetchData();
    }
  }, [appMetaContext.addedNewLoan]);

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

  function clickHandler(event, url) {
    navigate(url);
  }

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
          <div
            key={obj.loanId}
            onClick={(event) =>
              clickHandler(event, "/dashboard/transactions/" + obj.loanId)
            }
          >
            <LoanSummaryCard
              data={obj}
              clickable={true}
              columns={4}
              color={colors[idx % colors.length]}
            />
          </div>
        ))}
      </div>
    </BasePage>
  );
}

export default LoanTransactionsPage;

import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineSubject, MdPeopleOutline } from "react-icons/md";

import LoanSummaryCard from "../components/LoanSummaryCard";
import LenderBreakdownTable from "../components/LenderBreakdownTable";
import BasePage from "./BasePage";
import PaymentTable from "../components/PaymentTable";
import BreakdownChart from "../components/BreakdownChart";
import Table from "../components/Table";
import UserAuthContext from "../context/user-auth-context";

function LoanDetailsPage() {
  const params = useParams();
  const loanId = parseInt(params.loanId);

  const [loanTransaction, setLoanTransaction] = useState({});
  const [lenderBreakdown, setLenderBreakdown] = useState([]);
  const [payments, setPayments] = useState([]);

  const userAuthContext = useContext(UserAuthContext);

  useEffect(() => {
    fetch(`/api/get-${userAuthContext.userType}-loan-transactions/${loanId}`)
      .then((res) => res.json())
      .then((data) => {
        setLoanTransaction(data.message[0]);
      });

    fetch(`/api/get-lender-breakdown/${loanId}`)
      .then((res) => res.json())
      .then((data) => {
        setLenderBreakdown([...data.message]);
      });

    fetch(`/api/get-payments/${loanId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        setPayments([...data.message]);
      });
  }, []);

  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4 className="icon-cont icon-cont-center">
          <MdOutlineSubject />
          <span className="margin-left text-overflow">
            Loan {loanId} - Details
          </span>
        </h4>
        {Object.keys(loanTransaction).length > 0 && (
          <div className="w3-row">
            <LoanSummaryCard
              data={loanTransaction}
              clickable={false}
              columns={4}
              color="w3-teal"
              currentUser={userAuthContext}
            />
          </div>
        )}
        {lenderBreakdown.length > 0 && (
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
                color="w3-blue"
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
        )}

        {payments.length > 0 && (
          <div className="w3-row">
            <PaymentTable
              data={payments}
              loanId={loanId}
              color="w3-green"
              currentUser={userAuthContext}
            />
          </div>
        )}
      </div>
    </BasePage>
  );
}

export default LoanDetailsPage;

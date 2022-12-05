import { useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineHome, MdOutlineTableRows } from "react-icons/md";
import Chart from "chart.js/auto";
import { Colors } from "chart.js";

import UserAuthContext from "../context/user-auth-context";
import BasePage from "./BasePage";
import Table from "../components/Table";
import HorizontalTable from "../components/HorizontalTable";
import BreakdownChart from "../components/BreakdownChart";

function DashboardPage(props) {
  const navigate = useNavigate();
  const userAuthContext = useContext(UserAuthContext);

  const tableData = [
    {
      loanId: 1,
      debtor: "Debtor 1",
      amortizationPerWithdrawal: 5000,
      balanceAmortization: 10000,
      receiptDate: "18-11-2022",
    },
    {
      loanId: 2,
      debtor: "Debtor 2",
      amortizationPerWithdrawal: 25000,
      balanceAmortization: 110000,
      receiptDate: "18-11-2022",
    },
    {
      loanId: 3,
      debtor: "Debtor 3",
      amortizationPerWithdrawal: 15000,
      balanceAmortization: 120000,
      receiptDate: "18-11-2022",
    },
    {
      loanId: 4,
      debtor: "Debtor 4",
      amortizationPerWithdrawal: 35000,
      balanceAmortization: 130000,
      receiptDate: "18-11-2022",
    },
  ];

  const balanceAmortizationBreakdown = {
    cumulativeBalAmortization: 70000,
    cumulativeCompAmortization: 105605050,
    breakdown: [
      { debtor: "Debtor 1", cumulativeBal: 40000 },
      { debtor: "Debtor 2", cumulativeBal: 30000 },
      { debtor: "Debtor 3", cumulativeBal: 10000 },
    ],
  };

  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4 className="icon-cont icon-cont-center">
          <MdOutlineHome />
          <span className="margin-left text-overflow">Dashboard</span>
        </h4>
        <h4>Welcome, {userAuthContext.fullname}!</h4>
        <div className="w3-container w3-display-container w3-card w3-margin-top">
          <div className="w3-half full-height">
            <div className="w3-margin">
              <Table
                icon={MdOutlineTableRows}
                title="Cumulative Balance Amortization"
                data={balanceAmortizationBreakdown.breakdown}
                keys={["debtor", "cumulativeBal"]}
              />
            </div>
          </div>
          <div className="w3-quarter w3-padding-left">
            <div className="w3-margin">
              <HorizontalTable
                icon={MdOutlineTableRows}
                title="Summary"
                data={balanceAmortizationBreakdown}
                keys={[
                  "cumulativeBalAmortization",
                  "cumulativeCompAmortization",
                ]}
              />
            </div>
          </div>

          <div className="w3-quarter">
            <div>
              <BreakdownChart
                breakdown={balanceAmortizationBreakdown.breakdown.map((obj) => {
                  return { label: obj.debtor, value: obj.cumulativeBal };
                })}
                title="Cumulative Balance Amortization"
              />
            </div>
          </div>
        </div>

        <Table
          icon={MdOutlineTableRows}
          title="Cumulative Balance Amortization Breakdown"
          data={tableData}
          keys={[
            "loanId",
            "debtor",
            "amortizationPerWithdrawal",
            "balanceAmortization",
            "receiptDate",
          ]}
          headers={[
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

export default DashboardPage;

import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineHome, MdOutlineTableRows } from "react-icons/md";

import UserAuthContext from "../context/user-auth-context";
import BasePage from "./BasePage";
import Table from "../components/Table";

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

  const tableHeaders = [
    "loanId",
    "debtor",
    "amortizationPerWithdrawal",
    "balanceAmortization",
    "receiptDate",
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

  // const breakdownChartCanvas = useRef();

  // const breakdownChartConfig = {
  //   type: "pie",
  //   data: data,
  // };

  // const breakdownChartData = {
  //   labels: ["Red", "Blue", "Yellow"],
  //   datasets: [
  //     {
  //       label: "My First Dataset",
  //       data: [300, 50, 100],
  //       backgroundColor: [
  //         "rgb(255, 99, 132)",
  //         "rgb(54, 162, 235)",
  //         "rgb(255, 205, 86)",
  //       ],
  //       hoverOffset: 4,
  //     },
  //   ],
  // };

  // const breakdownChart = new Chart(ctx, config);

  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4 className="icon-cont icon-cont-center">
          <MdOutlineHome />
          <span className="margin-left text-overflow">Dashboard</span>
        </h4>
        <h4>Welcome, {userAuthContext.fullname}!</h4>
        <div className="w3-container w3-border">
          <div className="w3-twothird">
            <div className="w3-container">Table here</div>
            <div className="w3-container">
              <div className="w3-half">
                Cumulative Balance Amortization:{" "}
                {balanceAmortizationBreakdown.cumulativeBalAmortization}
              </div>
              <div className="w3-half">
                Cumulative Completed Amortization:{" "}
                {balanceAmortizationBreakdown.cumulativeCompAmortization}
              </div>
            </div>
          </div>
          <div className="w3-third">asdsad</div>
        </div>

        <Table
          icon={MdOutlineTableRows}
          title="Balance Amortization Breakdown"
          data={tableData}
          headers={tableHeaders}
        />
      </div>
    </BasePage>
  );
}

export default DashboardPage;

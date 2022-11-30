import { useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineHome, MdOutlineTableRows } from "react-icons/md";
import Chart from "chart.js/auto";
import { Colors } from "chart.js";

import UserAuthContext from "../context/user-auth-context";
import BasePage from "./BasePage";
import Table from "../components/Table";
import HorizontalTable from "../components/HorizontalTable";

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

  const breakdownChartCanvasRef = useRef();

  const breakdownChartData = {
    labels: balanceAmortizationBreakdown.breakdown.map((obj) => obj.debtor),
    datasets: [
      {
        label: "",
        data: balanceAmortizationBreakdown.breakdown.map(
          (obj) => obj.cumulativeBal
        ),
      },
    ],
  };

  const breakdownChartConfig = {
    type: "pie",
    data: breakdownChartData,
  };

  useEffect(() => {
    const breakdownChartCtx = breakdownChartCanvasRef.current.getContext("2d");
    Chart.register(Colors);
    const breakdownChart = new Chart(breakdownChartCtx, breakdownChartConfig);
  }, []);

  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4 className="icon-cont icon-cont-center">
          <MdOutlineHome />
          <span className="margin-left text-overflow">Dashboard</span>
        </h4>
        <h4>Welcome, {userAuthContext.fullname}!</h4>
        <div className="w3-container w3-card w3-margin w3-padding">
          <div className="w3-twothird">
            <div className="w3-container">
              <HorizontalTable
                icon={MdOutlineTableRows}
                title="Balance Amortization Breakdown"
                data={balanceAmortizationBreakdown.breakdown}
                headers={["debtor", "cumulativeBal"]}
              />
            </div>
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
          <div className="w3-third w3-container w3-center">
            <div className="w3-half">
              <canvas ref={breakdownChartCanvasRef}></canvas>
            </div>
          </div>
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

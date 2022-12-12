import { useContext, useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

  const [balanceAmortizationBreakdown, setBalanceAmortizationBreakdown] =
    useState({});

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (userAuthContext.userType === "lender") {
      fetch("/api/get-cumulative-bal-breakdown")
        .then((res) => res.json())
        .then((data) => {
          setBalanceAmortizationBreakdown(data.message);
        });

      fetch("/api/get-personal-transactions-table")
        .then((res) => res.json())
        .then((data) => {
          setTableData([...data.message]);
        });
    }
  }, []);

  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4 className="icon-cont icon-cont-center">
          <MdOutlineHome />
          <span className="margin-left text-overflow">Dashboard</span>
        </h4>
        <h4>Welcome, {userAuthContext.fullname}!</h4>
        {userAuthContext.userType === "debtor" && (
          <p>
            View your{" "}
            <Link to="/dashboard/transactions">personal transactions.</Link>
          </p>
        )}
        {Object.keys(balanceAmortizationBreakdown).length > 0 && (
          <div className="w3-container w3-display-container w3-border w3-hover-shadow w3-round-xlarge w3-margin-top">
            <div className="w3-half full-height">
              <div className="w3-margin">
                <Table
                  icon={MdOutlineTableRows}
                  title="Cumulative Balance Amortization"
                  data={balanceAmortizationBreakdown.breakdown}
                  keys={["debtor", "cumulativeBal"]}
                  color="w3-pink"
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
                  color="w3-deep-purple"
                />
              </div>
            </div>

            <div className="w3-quarter">
              <div>
                <BreakdownChart
                  breakdown={balanceAmortizationBreakdown.breakdown.map(
                    (obj) => {
                      return { label: obj.debtor, value: obj.cumulativeBal };
                    }
                  )}
                  title="Cumulative Balance Amortization"
                />
              </div>
            </div>
          </div>
        )}

        {tableData.length > 0 && (
          <Table
            icon={MdOutlineTableRows}
            title="Cumulative Balance Amortization Breakdown"
            data={tableData}
            keys={[
              "loanId",
              "debtor",
              "amortizationPerWithdrawal",
              "balanceAmortization",
              "paymentDate",
            ]}
            color="w3-teal"
          />
        )}
      </div>
    </BasePage>
  );
}

export default DashboardPage;

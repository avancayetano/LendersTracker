import { MdPeopleOutline } from "react-icons/md";

function LenderBreakdownTable(props) {
  const order = [
    "lender",
    "contribution",
    "amortizationPerWithdrawal",
    "amountAtEnd",
    "completedAmortization",
    "balanceAmortization",
  ];

  return (
    <div className="w3-card w3-margin loan-summary-max-height">
      <div className="w3-display-container w3-row w3-light-grey">
        <div className="w3-padding w3-left icon-cont icon-cont-center">
          <MdPeopleOutline />
          <span className="margin-left text-overflow">Lender Breakdown</span>
        </div>
      </div>
      <div className="w3-responsive w3-small">
        <table className="w3-table">
          <tbody>
            <tr className="w3-border-bottom">
              <th className="w3-center">Lenders</th>
              <th className="w3-center">Principal Amount Contribution</th>
              <th className="w3-center">Amortization per withdrawal</th>
              <th className="w3-center">Amount at end</th>
              <th className="w3-center">Completed amortization</th>
              <th className="w3-center">Balance amortization</th>
            </tr>
            {props.data.map((obj, i) => (
              <tr key={"row-" + i}>
                {order.map((key, j) => (
                  <td className="w3-center" key={"row-" + i + "-col-" + j}>
                    {obj[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LenderBreakdownTable;

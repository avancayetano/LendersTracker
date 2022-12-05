import { MdPeopleOutline } from "react-icons/md";
import format from "../format";

function LenderBreakdownTable(props) {
  const keys = [
    "lender",
    "contribution",
    "amortizationPerWithdrawal",
    "amountAtEnd",
    "completedAmortization",
    "balanceAmortization",
  ];

  return (
    <div className="w3-card w3-section loan-summary-max-height">
      <div className="w3-display-container w3-row w3-dark-grey">
        <div className="w3-padding w3-left icon-cont icon-cont-center">
          <MdPeopleOutline />
          <span className="margin-left text-overflow">Lender Breakdown</span>
        </div>
      </div>
      <div className="w3-responsive w3-small">
        <table className="w3-table">
          <tbody>
            <tr className="w3-border-bottom">
              {keys.map((label, i) => (
                <th className="w3-center" key={label}>
                  {format(label, true)}
                </th>
              ))}
            </tr>
            {props.data.map((obj, i) => (
              <tr key={"row-" + i} className="w3-hover-light-grey">
                {keys.map((label, j) => (
                  <td className="w3-center" key={"row-" + i + "-col-" + j}>
                    {format(obj[label])}
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

import { MdOutlineMoney } from "react-icons/md";

function PaymentTable(props) {
  const order = ["period", "receiptDate", "amortization"];
  const headers = order.concat(
    props.data[0].status.map((obj, idx) => "Status for " + obj.lender)
  );
  return (
    <div className="w3-card w3-section loan-summary-max-height">
      <div className="w3-display-container w3-row w3-dark-grey">
        <div className="w3-padding w3-left icon-cont icon-cont-center">
          <MdOutlineMoney />
          <span className="margin-left text-overflow">Payments</span>
        </div>
      </div>
      <div className="w3-responsive w3-small">
        <table className="w3-table">
          <tbody>
            <tr className="w3-border-bottom">
              {headers.map((label, idx) => (
                <th
                  key={"header-" + label}
                  className="w3-center vertical-align"
                >
                  {label}
                </th>
              ))}
            </tr>
            {props.data.map((obj, i) => (
              <tr key={"row-" + i}>
                {headers.map((label, j) => {
                  if (order.includes(label)) {
                    return (
                      <td key={"row-" + i + "-col-" + j} className="w3-center">
                        {obj[label]}
                      </td>
                    );
                  } else {
                    return (
                      <td key={"row-" + i + "-col-" + j} className="w3-center">
                        {obj.status[j - order.length].received
                          ? "Received"
                          : ""}
                      </td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentTable;

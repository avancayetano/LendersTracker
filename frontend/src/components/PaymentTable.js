import { useState } from "react";
import {
  MdOutlineMoney,
  MdOutlineSave,
  MdOutlineArrowDropDown,
  MdOutlineExpandMore,
} from "react-icons/md";

function PaymentTable(props) {
  const order = ["period", "receiptDate", "amortization"];
  const headers = order.concat(
    props.data[0].status.map((obj, idx) => "Status for " + obj.lender)
  );

  const currentUser = "Lender 1";

  const [paymentData, setPaymentData] = useState(props.data);

  function paymentStatusHandler(event, idx) {
    event.preventDefault();
    setPaymentData((prevData) => {
      const newData = structuredClone(prevData);
      const received = event.target.value === "Received" ? true : false;
      newData[idx].status = newData[idx].status.map((obj) =>
        obj.lender === currentUser
          ? { lender: obj.lender, received: received }
          : obj
      );
      return newData;
    });
  }

  function saveHandler() {
    console.log(paymentData);
    const response = window.confirm("Save changes?");
  }

  return (
    <div className="w3-card w3-section loan-summary-max-height">
      <div className="w3-display-container w3-row w3-dark-grey">
        <div className="w3-padding w3-left icon-cont icon-cont-center">
          <MdOutlineMoney />
          <span className="margin-left text-overflow">Payments</span>
          <span className="w3-display-right">
            <button
              className={"w3-button w3-hover-blue w3-blue"}
              onClick={saveHandler}
            >
              <div className="icon-cont">
                <MdOutlineSave />
                <span className="margin-left">Save</span>
              </div>
            </button>
          </span>
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
            {paymentData.map((obj, i) => (
              <tr key={"row-" + i}>
                {headers.map((label, j) => {
                  if (order.includes(label)) {
                    return (
                      <td key={"row-" + i + "-col-" + j} className="w3-center">
                        {obj[label]}
                      </td>
                    );
                  } else {
                    if (label === "Status for " + currentUser) {
                      return (
                        <td
                          key={"row-" + i + "-col-" + j}
                          className="w3-center"
                        >
                          <select
                            value={
                              obj.status[j - order.length].received
                                ? "Received"
                                : ""
                            }
                            className="cursor w3-padding-left w3-hover-light-grey"
                            onChange={(event) => paymentStatusHandler(event, i)}
                          >
                            <option value="-">-</option>
                            <option value="Received">Received</option>
                          </select>
                        </td>
                      );
                    } else {
                      return (
                        <td
                          key={"row-" + i + "-col-" + j}
                          className="w3-center"
                        >
                          {obj.status[j - order.length].received
                            ? "Received"
                            : ""}
                        </td>
                      );
                    }
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

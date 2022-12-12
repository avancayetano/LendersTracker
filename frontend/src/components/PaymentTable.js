import { useState } from "react";
import {
  MdOutlineMoney,
  MdOutlineSave,
  MdOutlineArrowDropDown,
  MdOutlineExpandMore,
} from "react-icons/md";
import format from "../format";

function PaymentTable(props) {
  const order = ["period", "paymentDate", "amortization"];
  const keys = order.concat(
    props.data[0].status.map((obj, idx) => "Status For " + obj.lender.fullname)
  );

  const [paymentData, setPaymentData] = useState(props.data);

  function paymentStatusHandler(event, idx) {
    event.preventDefault();
    setPaymentData((prevData) => {
      const newData = structuredClone(prevData);
      const received = event.target.value === "Received" ? true : false;
      newData[idx].status = newData[idx].status.map((obj) =>
        obj.lender === props.currentUser.fullname
          ? { lender: obj.lender, received: received }
          : obj
      );
      return newData;
    });
  }

  function saveHandler() {
    const confirmed = window.confirm("Save changes?");

    if (confirmed) {
      fetch("/api/edit-payment-status", {
        method: "POST",
        body: JSON.stringify({
          loanId: props.loanId,
          paymentData: paymentData,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "OK") {
            console.log(data.message);
          } else {
            alert("Error.");
          }
        });
    }
  }

  const nameLabels = ["lender", "debtor"];

  return (
    <div className="w3-border w3-hover-shadow w3-round-xlarge w3-section loan-summary-max-height">
      <div className={"w3-display-container w3-row " + props.color}>
        <div className="w3-padding w3-left icon-cont icon-cont-center">
          <MdOutlineMoney />
          <span className="margin-left">Payments</span>
          {props.currentUser.userType === "lender" && (
            <span className="w3-display-right">
              <button
                className={"w3-button w3-hover-blue w3-blue w3-hover-shadow"}
                onClick={saveHandler}
              >
                <div className="icon-cont">
                  <MdOutlineSave />
                  <span className="margin-left">Save</span>
                </div>
              </button>
            </span>
          )}
        </div>
      </div>
      <div className="w3-responsive w3-small">
        <table className="w3-table text-overflow">
          <tbody>
            <tr className="w3-border-bottom">
              {keys.map((label, idx) => (
                <th
                  key={"header-" + label}
                  className="w3-center vertical-align"
                >
                  {format(label, true)}
                </th>
              ))}
            </tr>
            {paymentData.map((obj, i) => (
              <tr key={"row-" + i} className="w3-hover-light-grey">
                {keys.map((label, j) => {
                  if (order.includes(label)) {
                    return (
                      <td key={"row-" + i + "-col-" + j} className="w3-center">
                        {nameLabels.includes(label)
                          ? obj[label].fullname
                          : format(obj[label])}
                      </td>
                    );
                  } else {
                    if (label === "Status For " + props.currentUser.fullname) {
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
                            className="w3-border padding-x cursor w3-hover-light-grey"
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

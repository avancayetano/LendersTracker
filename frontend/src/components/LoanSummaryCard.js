import { useNavigate } from "react-router-dom";
import { MdOutlineDelete, MdOutlineStickyNote2 } from "react-icons/md";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Link } from "react-router-dom";

import format from "../format";

function LoanSummaryCard(props) {
  const navigate = useNavigate();

  const keys = [
    ["loanId", "status", "debtor", "principalAmount"],
    ["interest", "period", "withdrawalsPerMonth", "amortizationPerWithdrawal"],
    [
      "amountAtEnd",
      "completedAmortization",
      "balanceAmortization",
      "dateOfTransfer",
    ],
    ["proofOfTransfer", "lwt", "startPeriod", "endPeriod"],
    ["suretyDebtor", "contractSigned", "ackReceipts", "otherDocs"],
  ];

  function deleteHandler() {
    confirmAlert({
      title: "Delete loan?",
      message: "Are you sure you want to delete this Loan Transaction?",
      buttons: [
        {
          label: "Yes",
          onClick: () =>
            fetch("/api/delete-loan-transaction", {
              method: "POST",
              body: JSON.stringify({ loanId: props.data.loanId }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.status === "OK") {
                  console.log(data.message);
                  navigate("/dashboard/transactions");
                } else {
                  alert("Error.");
                }
              }),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  const urlLabels = [
    "proofOfTransfer",
    "contractSigned",
    "ackReceipts",
    "otherDocs",
  ];

  const nameLabels = ["lender", "debtor"];

  return (
    <div
      className={
        "w3-border w3-hover-shadow w3-round-xlarge w3-section loan-summary-max-height " +
        (props.clickable ? " clickable" : "")
      }
    >
      <div
        className={"overflow-hidden w3-display-container w3-row " + props.color}
      >
        <div className="w3-padding w3-left icon-cont icon-cont-center">
          {!props.clickable ? (
            <>
              <MdOutlineStickyNote2 />
              <span className="margin-left">Loan Summary</span>
              {props.currentUser.userType === "lender" && (
                <span className="w3-display-right">
                  <button
                    className={"w3-button w3-hover-red w3-red w3-hover-shadow"}
                    onClick={deleteHandler}
                  >
                    <div className="icon-cont">
                      <MdOutlineDelete />
                      <span className="margin-left">Delete</span>
                    </div>
                  </button>
                </span>
              )}
            </>
          ) : (
            <div className="w3-small">
              <MdOutlineStickyNote2 />
              <span className="margin-left">
                {props.data.debtor.fullname}'s Loan
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="w3-responsive w3-small">
        <table className="w3-table text-overflow">
          <tbody>
            {keys.map((arr, i) => (
              <tr key={"row-" + i}>
                {arr.map((label, j) => (
                  <td
                    key={"row-" + i + "-col-" + j}
                    className={
                      "" + (props.clickable ? "" : "w3-hover-shadow w3-round")
                    }
                  >
                    <div className="w3-half w3-center">
                      {format(label, true)}
                    </div>
                    <div className="w3-half w3-center w3-light-grey text-overflow">
                      {urlLabels.includes(label)
                        ? props.data[label] && (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w3-text-blue link"
                              href={format(props.data[label], null, true)}
                            >
                              Click this link.
                            </a>
                          )
                        : nameLabels.includes(label)
                        ? props.data[label].fullname
                        : format(props.data[label])}
                    </div>
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

export default LoanSummaryCard;

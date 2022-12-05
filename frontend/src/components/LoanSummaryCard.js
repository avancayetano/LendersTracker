import { MdOutlineDelete, MdOutlineStickyNote2 } from "react-icons/md";
import format from "../format";

function LoanSummaryCard(props) {
  // todo: make a fixed order of labels
  const tableLabels = Object.keys(props.data).reduce((prev, curr, idx, arr) => {
    if (idx % props.columns === 0) {
      prev.push([curr]);
    } else {
      prev[prev.length - 1].push(curr);
    }
    return prev;
  }, []);

  function deleteHandler() {
    const response = window.confirm(
      "Are you sure you want to delete this Loan Transaction?"
    );
  }

  return (
    <div
      className={
        "w3-card w3-section loan-summary-max-height" +
        (props.clickable ? " clickable w3-hover-light-grey" : "")
      }
    >
      <div className="w3-display-container w3-row w3-dark-grey">
        <div className="w3-padding w3-left icon-cont icon-cont-center">
          {!props.clickable && (
            <>
              <MdOutlineStickyNote2 />
              <span className="margin-left">Loan Summary</span>
              <span className="w3-display-right">
                <button
                  className={"w3-button w3-hover-red w3-red"}
                  onClick={deleteHandler}
                >
                  <div className="icon-cont">
                    <MdOutlineDelete />
                    <span className="margin-left">Delete</span>
                  </div>
                </button>
              </span>
            </>
          )}
        </div>
      </div>

      <div className="w3-responsive w3-small">
        <table className="w3-table text-overflow">
          <tbody>
            {tableLabels.map((arr, i) => (
              <tr key={"row-" + i}>
                {arr.map((label, j) => (
                  <td
                    key={"row-" + i + "-col-" + j}
                    className={props.clickable ? "" : "w3-hover-dark-grey"}
                  >
                    <div className="w3-half w3-center">
                      {format(label, true)}
                    </div>
                    <div className="w3-half w3-center w3-light-grey">
                      {format(props.data[label])}
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

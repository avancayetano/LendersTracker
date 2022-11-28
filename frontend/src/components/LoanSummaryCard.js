import { MdOutlineDelete, MdOutlineStickyNote2 } from "react-icons/md";

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
        "w3-card w3-margin loan-summary-max-height" +
        (props.clickable ? " clickable w3-hover-light-grey" : "")
      }
    >
      {!props.clickable && (
        <div className="w3-display-container w3-row w3-light-grey">
          <div className="w3-padding w3-left icon-cont icon-cont-center">
            <MdOutlineStickyNote2 />
            <span className="margin-left text-overflow">Loan Summary</span>
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
          </div>
        </div>
      )}

      <div className="w3-responsive w3-small">
        <table className="w3-table">
          <tbody>
            {tableLabels.map((arr, i) => (
              <tr key={"row-" + i}>
                {arr.map((label, j) => (
                  <td key={"row-" + i + "-col-" + j}>
                    <div className="w3-half w3-center">{label}</div>
                    <div className="w3-half w3-center w3-light-grey">
                      {props.data[label]}
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

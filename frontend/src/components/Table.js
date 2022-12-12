import { useState, useEffect } from "react";

import format from "../format";

function Table(props) {
  const [sortBy, setSortBy] = useState(props.keys[0]);
  const [isAscending, setIsAscending] = useState(true);
  const [data, setData] = useState(props.data);

  function sortHandler(label) {
    if (sortBy === label) {
      setIsAscending(!isAscending);
    }
    setSortBy(label);
  }

  useEffect(() => {
    setData((prevData) =>
      [...prevData].sort((a, b) => {
        var comparison;
        if (typeof a[sortBy] === "string") {
          comparison = a[sortBy].localeCompare(b[sortBy]);
        } else {
          comparison = a[sortBy] - b[sortBy];
        }

        return isAscending ? comparison : -comparison;
      })
    );
  }, [sortBy, isAscending]);

  const nameLabels = ["lender", "debtor"];

  return (
    <div className="w3-section loan-summary-max-height w3-border w3-hover-shadow w3-round-xlarge">
      <div className={"w3-display-container w3-row " + props.color}>
        <div className="w3-padding w3-left icon-cont icon-cont-center">
          <props.icon />
          <span className="margin-left">{props.title}</span>
        </div>
      </div>

      <div className="w3-responsive">
        <table className="w3-table w3-small w3-centered text-overflow">
          <tbody>
            <tr>
              {(props.headers || props.keys).map((label) => (
                <th
                  key={label}
                  onClick={() => sortHandler(label)}
                  className={
                    "cursor noselect w3-hover-light-grey" +
                    (sortBy === label ? " w3-light-grey" : "")
                  }
                >
                  {format(label, true)}
                  {label === sortBy ? (
                    isAscending ? (
                      " ▼"
                    ) : (
                      " ▲"
                    )
                  ) : (
                    <span className="invisible"> ▲</span>
                  )}
                </th>
              ))}
            </tr>
            {data.map((obj, i) => (
              <tr key={"row-" + i} className="w3-hover-light-grey">
                {props.keys.map((label, j) => (
                  <td key={"row-" + i + "-col-" + j}>
                    {nameLabels.includes(label)
                      ? obj[label].fullname
                      : format(obj[label])}
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

export default Table;

import { useState, useEffect } from "react";

function Table(props) {
  const [sortBy, setSortBy] = useState(props.headers[0]);
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

  return (
    <div className="w3-card w3-section loan-summary-max-height">
      <div className="w3-display-container w3-row w3-dark-grey">
        <div className="w3-padding w3-left icon-cont icon-cont-center">
          <props.icon />
          <span className="margin-left text-overflow">{props.title}</span>
        </div>
      </div>

      <div className="w3-responsive">
        <table className="w3-table w3-small w3-centered text-overflow">
          <tbody>
            <tr>
              {props.headers.map((label) => (
                <th
                  key={label}
                  onClick={() => sortHandler(label)}
                  className="cursor noselect w3-hover-light-grey"
                >
                  {label}
                  {label === sortBy ? (
                    isAscending ? (
                      "▼"
                    ) : (
                      "▲"
                    )
                  ) : (
                    <span className="invisible">▲</span>
                  )}
                </th>
              ))}
            </tr>
            {data.map((obj, i) => (
              <tr key={"row-" + i}>
                {props.headers.map((label, j) => (
                  <td key={"row-" + i + "-col-" + j}>{obj[label]}</td>
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

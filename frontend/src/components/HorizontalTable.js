function HorizontalTable(props) {
  return (
    <div className="w3-card w3-section loan-summary-max-height">
      <div className="w3-display-container w3-row w3-dark-grey">
        <div className="w3-padding w3-left icon-cont icon-cont-center">
          <props.icon />
          <span className="margin-left text-overflow">{props.title}</span>
        </div>
      </div>
      <div className="w3-responsive">
        <table className="w3-table w3-centered w3-small">
          <tbody>
            {props.data.map((obj, i) => (
              <tr key={"row-" + i}>
                {props.headers.map((label, j) =>
                  j === 0 ? (
                    <th key={"row-" + i + "-col-" + j}>{obj[label]}</th>
                  ) : (
                    <td key={"row-" + i + "-col-" + j}>{obj[label]}</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HorizontalTable;

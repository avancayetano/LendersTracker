import format from "../format";

// Two column table - a little of a misnomer actually
function HorizontalTable(props) {
  return (
    <div className="w3-section w3-animate-bottom loan-summary-max-height w3-border w3-hover-shadow w3-round-xlarge">
      <div className={"w3-display-container w3-row " + props.color}>
        <div className="w3-padding w3-left icon-cont icon-cont-center">
          <props.icon />
          <span className="margin-left">{props.title}</span>
        </div>
      </div>
      <div className="w3-responsive">
        <table className="w3-table w3-centered w3-small">
          <tbody>
            {props.keys.map((label, i) => (
              <tr key={"row-" + i} className="w3-hover-light-grey">
                <th>{format(label, true)}</th>
                <td>{format(props.data[label])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HorizontalTable;

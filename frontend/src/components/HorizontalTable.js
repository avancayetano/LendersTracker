import format from "../format";

// Two column table - a little of a misnomer actually
function HorizontalTable(props) {
  return (
    <div
      className={`w3-section w3-animate-bottom overflow-hidden w3-border w3-hover-shadow w3-round-xlarge ${props.addtlClassNames}`}
    >
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
                {props.keysIcons ? (
                  <th>
                    <div className="w3-left icon-cont icon-cont-center">
                      {props.keysIcons[i]}
                      <span className="margin-left">{format(label, true)}</span>
                    </div>
                  </th>
                ) : (
                  <th>{format(label, true)}</th>
                )}

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

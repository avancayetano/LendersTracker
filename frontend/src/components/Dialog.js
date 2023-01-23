import Overlay from "./Overlay";

function Dialog(props) {
  return (
    <>
      <Overlay />
      <div
        className={
          "w3-col s11 m6 l4 w3-white w3-card middle animate-top-to-center w3-border w3-hover-shadow w3-round-xlarge z-2"
        }
      >
        <div className="w3-padding-small">
          <div className="w3-container w3-center">
            <h4 className="icon-cont icon-cont-center">
              {props.icon && <props.icon />}
              <span className="margin-left">
                <b>{props.title}</b>
              </span>
            </h4>
            <h6>{props.description}</h6>
            {props.buttons.map((obj, idx) => (
              <div
                key={obj.label}
                onClick={obj.buttonHandler}
                className={`w3-round-large w3-btn w3-margin ${obj.color}`}
              >
                {obj.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dialog;

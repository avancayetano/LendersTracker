function Dialog(props) {
  return (
    <div
      className={
        "w3-col s11 m7 l5 w3-display-middle w3-white w3-card form-max-height-2 w3-border w3-hover-shadow w3-round-xlarge"
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
              className="w3-button"
            >
              {obj.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dialog;

import { MdOutlineClose } from "react-icons/md";

function Form(props) {
  return (
    <div
      className={
        "middle animate-top-to-center w3-col s11 m7 l5 w3-white z-3 " +
        (props.closeHandler
          ? "w3-card form-max-height-2"
          : "form-max-height-1 w3-border w3-hover-shadow w3-round-xlarge")
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
          {props.closeHandler && (
            <div
              className="w3-display-topright w3-button w3-hover-pale-red"
              onClick={props.closeHandler}
            >
              <MdOutlineClose />
            </div>
          )}
        </div>
        {props.children}
      </div>
    </div>
  );
}

export default Form;

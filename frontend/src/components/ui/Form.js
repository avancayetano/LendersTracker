import { MdOutlineClose } from "react-icons/md";

function Form(props) {
  return (
    <div className="w3-col s11 m7 l5 w3-card w3-display-middle w3-white">
      <div className="w3-padding-small">
        <div className="w3-container w3-center">
          <h4 className="icon-cont icon-cont-center">
            {props.icon && <props.icon />}
            <span className="margin-left">{props.title}</span>
          </h4>
          {props.closeHandler && (
            <div
              className="w3-display-topright w3-button"
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

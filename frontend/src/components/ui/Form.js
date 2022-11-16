function Form(props) {
  return (
    <div className="w3-col s11 m6 l4 w3-card w3-display-middle">
      <div className="w3-padding-small">
        <div className="w3-container w3-center">
          <h4 className="icon-cont icon-cont-center">
            {props.icon && <props.icon />}
            <span className="margin-left">{props.title}</span>
          </h4>
        </div>
        {props.children}
      </div>
    </div>
  );
}

export default Form;

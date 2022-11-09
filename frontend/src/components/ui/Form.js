function Form(props) {
  return (
    <div className="w3-container w3-center">
      <div className="w3-mobile w3-half w3-display-middle">
        <div className="w3-card w3-stretch w3-margin w3-padding-small">
          <div className="w3-container w3-center">
            <h4>{props.title}</h4>
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default Form;

import classes from "./Form.module.css";

function Form(props) {
  return (
    <div className={classes.main}>
      <div className={classes.container}>
        <h2>{props.title}</h2>
        {props.children}
      </div>
    </div>
  );
}

export default Form;

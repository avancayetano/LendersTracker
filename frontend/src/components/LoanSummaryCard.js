function LoanSummaryCard(props) {
  return (
    <div className="w3-card w3-margin w3-padding-large loan-summary-max-height">
      <div className="w3-row">
        {Object.keys(props.data).map((objKey, objIdx) => (
          <div
            className="w3-padding-small w3-quarter w3-small w3-border"
            key={objIdx}
          >
            <div className="w3-half text-overflow">{objKey}</div>
            <div className="w3-half text-overflow">{props.data[objKey]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoanSummaryCard;

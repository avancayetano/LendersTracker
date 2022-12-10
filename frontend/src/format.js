const transform = {
  ackReceipts: "Acknowledgment Receipts",
  cumulativeBal: "Cumulative Balance",
  cumulativeBalAmortization: "Cumulative Balance Amortization",
  cumulativeCompAmortization: "Cumulative Completed Amortization",
  otherDocs: "Other Documents",
  lwt: "Lender Who Transferred",
  receiptDateAlt: "Date Expected To Receive",
};

function format(value, isLabel = false) {
  if (isLabel) {
    return transform.hasOwnProperty(value)
      ? transform[value]
      : value.replace(/(^[a-z])|([A-Z])/g, (x, p1, p2) =>
          p1 ? x.toUpperCase() : ` ${x}`
        );
  } else {
    return typeof value === "number" ? value.toLocaleString() : value;
  }
}

export default format;

import { useContext, useState, useRef } from "react";
import {
  MdOutlineAttachMoney,
  MdOutlineAdd,
  MdOutlinePeopleAlt,
} from "react-icons/md";

import Form from "./ui/Form";
import AppMetaContext from "../context/app-meta-context";

function AddLoanForm() {
  const appMetaContext = useContext(AppMetaContext);
  const [lenderContribPairs, setLenderContribPairs] = useState([]);

  const debtorRef = useRef();
  const principalAmountRef = useRef();
  const interestRef = useRef();
  const periodRef = useRef();
  const withdrawalsPerMonthRef = useRef();
  const dateOfTransferRef = useRef();
  const proofOfTransferRef = useRef();
  const lenderWhoTransferredRef = useRef();
  const suretyDebtorRef = useRef();
  const startPeriodRef = useRef();
  const contractSignedRef = useRef();
  const ackReceiptsRef = useRef();
  const otherDocsRef = useRef();

  function closeHandler() {
    appMetaContext.setIsAddLoanFormOpen(false);
  }

  function addLenderContribPair(event) {
    event.preventDefault();
    setLenderContribPairs((prevLenderContribPairs) =>
      prevLenderContribPairs.concat({
        lender: "",
        contribution: 0,
      })
    );
  }

  // Note to self: this can still be optimized using an array of Refs instead of event listening
  function editLenderContribPair(event, idx, editField) {
    event.preventDefault();
    setLenderContribPairs((contribPairs) => {
      const newContribPairs = structuredClone(contribPairs);
      newContribPairs[idx][editField] = event.target.value;
      return newContribPairs;
    });
  }

  function removeLenderContribPair(removeIdx) {
    setLenderContribPairs((contribPairs) =>
      contribPairs.filter((curr, idx) => idx !== removeIdx)
    );
  }

  function submitHandler(event) {
    event.preventDefault();

    const debtor = debtorRef.current.value;
    const principalAmount = principalAmountRef.current.value;
    const interest = interestRef.current.value;
    const period = periodRef.current.value;
    const withdrawalsPerMonth = withdrawalsPerMonthRef.current.value;
    const dateOfTransfer = dateOfTransferRef.current.value;
    const proofOfTransfer = proofOfTransferRef.current.value;
    const lenderWhoTransferred = lenderWhoTransferredRef.current.value;
    const suretyDebtor = suretyDebtorRef.current.value;
    const startPeriod = startPeriodRef.current.value;
    const contractSigned = contractSignedRef.current.value;
    const ackReceipts = ackReceiptsRef.current.value;
    const otherDocs = otherDocsRef.current.value;

    const content = {
      debtor,
      principalAmount,
      interest,
      period,
      withdrawalsPerMonth,
      dateOfTransfer,
      proofOfTransfer,
      lenderWhoTransferred,
      suretyDebtor,
      startPeriod,
      contractSigned,
      ackReceipts,
      otherDocs,
      lenderContribPairs,
    };
    console.log(content);
    closeHandler();
  }

  return (
    <>
      <Form
        title="Add Loan Transaction."
        icon={MdOutlineAttachMoney}
        closeHandler={closeHandler}
      >
        <form
          autoComplete="off"
          encType="multipart/form-data"
          onSubmit={submitHandler}
        >
          <div className="w3-row">
            <label htmlFor="debtor" className="w3-small text-overflow">
              Debtor
            </label>
            <input
              className="w3-input w3-center w3-border"
              type="text"
              required
              id="debtor"
              ref={debtorRef}
            />
          </div>
          <div className="w3-row">
            <div className="w3-twothird">
              <label htmlFor="amount" className="w3-small text-overflow">
                Principal amount
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="number"
                required
                id="amount"
                ref={principalAmountRef}
              />
            </div>
            <div className="w3-third">
              <label htmlFor="interest" className="w3-small text-overflow">
                Interest
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="number"
                required
                id="interest"
                ref={interestRef}
              />
            </div>
          </div>
          <div className="w3-row">
            <div className="w3-half">
              <label htmlFor="period" className="w3-small text-overflow">
                Period (months)
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="number"
                required
                id="period"
                ref={periodRef}
              />
            </div>
            <div className="w3-half">
              <label
                htmlFor="withdrawals-per-month"
                className="w3-small text-overflow"
              >
                Withdrawals per month
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="number"
                required
                id="withdrawals-per-month"
                ref={withdrawalsPerMonthRef}
              />
            </div>
          </div>
          <div className="w3-row">
            <div className="w3-half">
              <label htmlFor="date-transfer" className="w3-small text-overflow">
                Date of transfer
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="date"
                required
                id="date-transfer"
                ref={dateOfTransferRef}
              />
            </div>
            <div className="w3-half">
              <label
                htmlFor="proof-transfer"
                className="w3-small text-overflow"
              >
                Proof of transfer
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="file"
                required
                id="proof-transfer"
                ref={proofOfTransferRef}
              />
            </div>
          </div>
          <div className="w3-row">
            <div className="w3-half">
              <label
                htmlFor="lender-transfer"
                className="w3-small text-overflow"
              >
                Lender who transferred
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="text"
                required
                id="lender-transfer"
                ref={lenderWhoTransferredRef}
              />
            </div>
            <div className="w3-half">
              <label htmlFor="surety-debtor" className="w3-small text-overflow">
                Surety debtor
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="text"
                id="surety-debtor"
                ref={suretyDebtorRef}
              />
            </div>
          </div>
          <div className="w3-row">
            <div className="w3-half">
              <label htmlFor="start-period" className="w3-small text-overflow">
                Start period
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="date"
                required
                id="start-period"
                ref={startPeriodRef}
              />
            </div>
            <div className="w3-half">
              <label
                htmlFor="contract-signed"
                className="w3-small text-overflow"
              >
                Contract signed
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="file"
                id="contract-signed"
                ref={contractSignedRef}
              />
            </div>
          </div>
          <div className="w3-row">
            <div className="w3-half">
              <label htmlFor="ack-receipts" className="w3-small text-overflow">
                Acknowledgment receipts
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="file"
                id="ack-receipts"
                ref={ackReceiptsRef}
              />
            </div>
            <div className="w3-half">
              <label
                htmlFor="other-documents"
                className="w3-small text-overflow"
              >
                Other documents
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="file"
                id="other-documents"
                ref={otherDocsRef}
              />
            </div>
          </div>
          <div className="w3-row icon-cont icon-cont-center w3-center w3-padding-small w3-small">
            <MdOutlinePeopleAlt />
            <span className="margin-left text-overflow">
              Lender Contributions
            </span>
          </div>
          <div>
            {lenderContribPairs.map((obj, idx) => (
              <div className="w3-row" key={"lender-contrib-" + idx}>
                <div className="w3-twothird">
                  <input
                    className="w3-input w3-center w3-border"
                    type="text"
                    placeholder="Lender Name"
                    onChange={(event) => {
                      editLenderContribPair(event, idx, "lender");
                    }}
                    value={obj.lender}
                    required
                  />
                </div>
                <div className="w3-third">
                  <div className="w3-threequarter">
                    <input
                      className="w3-input w3-center w3-border"
                      type="number"
                      placeholder="Contribution"
                      required
                      onChange={(event) => {
                        editLenderContribPair(event, idx, "contribution");
                      }}
                      value={obj.contribution}
                    />
                  </div>
                  <div
                    className="w3-quarter w3-button w3-border w3-center"
                    title="Remove entry."
                    onClick={() => removeLenderContribPair(idx)}
                  >
                    -
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="w3-show icon-cont icon-cont-center w3-center w3-button w3-light-grey w3-padding-small w3-small"
            onClick={addLenderContribPair}
          >
            <MdOutlineAdd />
            <span className="margin-left text-overflow">
              Add Lender Contribution
            </span>
          </div>
          <p className="w3-center">
            <button className="w3-btn w3-black w3-border">Submit</button>
          </p>
        </form>
      </Form>
    </>
  );
}

export default AddLoanForm;

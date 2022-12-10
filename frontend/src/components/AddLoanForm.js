import { useContext, useState, useRef, useEffect } from "react";
import {
  MdOutlineAttachMoney,
  MdOutlineAdd,
  MdOutlinePeopleAlt,
  MdOutlineAddchart,
  MdOutlinePostAdd,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import Form from "./ui/Form";
import AppMetaContext from "../context/app-meta-context";

function AddLoanForm() {
  const navigate = useNavigate();

  const appMetaContext = useContext(AppMetaContext);
  const [lenderContribPairs, setLenderContribPairs] = useState([]);
  const [principalAmt, setPrincipalAmt] = useState(0);

  const [debtorsList, setDebtorsList] = useState([]);
  const [lendersList, setLendersList] = useState([]);

  const debtorRef = useRef();
  const principalAmountRef = useRef();
  const interestRef = useRef();
  const periodRef = useRef();
  const withdrawalsPerMonthRef = useRef();
  const dateOfTransferRef = useRef();
  const proofOfTransferRef = useRef();
  const lwtRef = useRef();
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

  useEffect(
    () =>
      setPrincipalAmt(
        lenderContribPairs.reduce(
          (prev, curr) =>
            prev + (curr.contribution ? parseFloat(curr.contribution) : 0),
          0
        )
      ),
    [lenderContribPairs]
  );

  useEffect(() => {
    fetch("/api/get-debtors-list")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          setDebtorsList(
            data.message.map((obj) => {
              return { value: obj.fullname, label: obj.fullname };
            })
          );
        } else {
          alert("Error.");
        }
      });
    fetch("/api/get-lenders-list")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          setLendersList(
            data.message.map((obj) => {
              return { value: obj.fullname, label: obj.fullname };
            })
          );
        } else {
          alert("Error.");
        }
      });
  }, []);

  // Note to self: this can still be optimized using an array of Refs instead of event listening
  function editLenderInLenderContribPair(value, idx) {
    setLenderContribPairs((contribPairs) => {
      const newContribPairs = structuredClone(contribPairs);
      newContribPairs[idx].lender = value.value;
      return newContribPairs;
    });
  }

  function editContribInLenderContribPair(event, idx) {
    setLenderContribPairs((contribPairs) => {
      const newContribPairs = structuredClone(contribPairs);
      newContribPairs[idx].contribution = event.target.value;
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

    const formData = new FormData();

    const debtor = debtorRef.current.getValue()[0].value;
    const principalAmount = principalAmountRef.current.value;
    const interest = interestRef.current.value;
    const period = periodRef.current.value;
    const withdrawalsPerMonth = withdrawalsPerMonthRef.current.value;
    const dateOfTransfer = dateOfTransferRef.current.value;

    const lwt = lwtRef.current.getValue()[0].value;
    const suretyDebtor = suretyDebtorRef.current.getValue()[0].value;
    const startPeriod = startPeriodRef.current.value;

    // files
    const proofOfTransfer = proofOfTransferRef.current.files[0];
    const contractSigned = contractSignedRef.current.files[0];
    const ackReceipts = ackReceiptsRef.current.files[0];
    const otherDocs = otherDocsRef.current.files[0];

    const files = {
      proofOfTransfer,
      contractSigned,
      ackReceipts,
      otherDocs,
    };

    const content = {
      debtor,
      principalAmount,
      interest,
      period,
      withdrawalsPerMonth,
      dateOfTransfer,
      lwt,
      suretyDebtor,
      startPeriod,
      lenderContribPairs,
    };

    for (const key in files) {
      formData.append(key, files[key]);
    }

    formData.append("inputs", JSON.stringify(content));

    fetch("/api/add-loan-transaction", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          navigate("/dashboard");
        } else {
          alert("Error.");
        }
      });

    closeHandler();
  }

  return (
    <>
      <Form
        title="Add Loan Transaction."
        icon={MdOutlinePostAdd}
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
            <Select
              options={debtorsList}
              id="debtor"
              ref={debtorRef}
              required={true}
            />
          </div>
          <div className="w3-row icon-cont icon-cont-center w3-center w3-padding w3-small">
            <MdOutlinePeopleAlt />
            <span className="margin-left text-overflow">
              Lender Contributions
            </span>
          </div>
          <div>
            {lenderContribPairs.map((obj, idx) => (
              <div className="w3-row" key={"lender-contrib-" + idx}>
                <div className="w3-twothird">
                  <Select
                    options={lendersList}
                    value={
                      lendersList.filter(
                        (lenderObj) => lenderObj.value === obj.lender
                      )[0]
                    }
                    onChange={(event) => {
                      editLenderInLenderContribPair(event, idx);
                    }}
                    required={true}
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
                        editContribInLenderContribPair(event, idx);
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

          <div className="w3-row">
            <div className="w3-twothird">
              <label htmlFor="amount" className="w3-small text-overflow">
                Principal amount
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="number"
                disabled
                id="amount"
                value={principalAmt}
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
                multiple
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
              <Select
                options={lendersList}
                required={true}
                id="lender-transfer"
                ref={lwtRef}
              />
            </div>
            <div className="w3-half">
              <label htmlFor="surety-debtor" className="w3-small text-overflow">
                Surety debtor
              </label>
              <Select
                options={debtorsList}
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
                multiple
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
                multiple
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
                multiple
                type="file"
                id="other-documents"
                ref={otherDocsRef}
              />
            </div>
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

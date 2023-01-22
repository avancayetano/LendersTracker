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
import UserAuthContext from "../context/user-auth-context";

function AddLoanForm() {
  const navigate = useNavigate();

  const appMetaContext = useContext(AppMetaContext);
  const userAuthContext = useContext(UserAuthContext);
  const [lenderContribPairs, setLenderContribPairs] = useState([
    {
      lender: userAuthContext.fullname,
      contribution: 0,
    },
  ]);

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
  const privacyRef = useRef();

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
          alert(data.message ? data.message : "Error.");
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
          alert(data.message ? data.message : "Error.");
        }
      });
  }, []);

  const privacyList = [
    {
      value: "public",
      label: "Public",
    },
    {
      value: "lenders",
      label: "All lenders",
    },
    {
      value: "participants",
      label: "Participants only",
    },
  ];

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
    const suretyDebtor = suretyDebtorRef.current.value;
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
          navigate("/dashboard/transactions");
          navigate(0);
        } else {
          alert(data.message ? data.message : "Error.");
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
        <div className="w3-text-red w3-center w3-small">* Required.</div>
        <form
          autoComplete="off"
          encType="multipart/form-data"
          onSubmit={submitHandler}
        >
          <div className="w3-row">
            <span className="twothird float-left">
              <label htmlFor="debtor" className="w3-small text-overflow">
                Debtor <span className="w3-text-red w3-small">*</span>
              </label>
              <Select
                className="icon-btn"
                options={debtorsList}
                id="debtor"
                ref={debtorRef}
                required={true}
              />
            </span>
            <span className="third float-left">
              <label htmlFor="privacy" className="w3-small text-overflow">
                Privacy <span className="w3-text-red w3-small">*</span>
              </label>
              <Select
                className="icon-btn"
                options={privacyList}
                id="privacy"
                ref={privacyRef}
                required={false}
              />
            </span>
          </div>
          <div className="w3-row icon-cont icon-cont-center w3-center w3-padding w3-small">
            <MdOutlinePeopleAlt />
            <span className="margin-left text-overflow">
              Lender Contributions
            </span>
          </div>
          {lenderContribPairs.length > 0 && (
            <div className="w3-row w3-small text-overflow">
              <span className="twothird float-left w3-center">
                Lender <span className="w3-text-red w3-small">*</span>
              </span>
              <span className="third float-left">
                <span className="threequarter float-left w3-center">
                  Contribution <span className="w3-text-red w3-small">*</span>
                </span>
              </span>
            </div>
          )}
          {lenderContribPairs.map((obj, idx) => (
            <div className="w3-row" key={"lender-contrib-" + idx}>
              <span className="twothird float-left">
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
                  isDisabled={idx === 0}
                />
              </span>
              <span className="third float-left">
                <span className={idx === 0 ? "" : "float-left threequarter"}>
                  <input
                    className="w3-input w3-center w3-border"
                    type="number"
                    step="0.01"
                    placeholder="Contribution"
                    required
                    onChange={(event) => {
                      editContribInLenderContribPair(event, idx);
                    }}
                    value={obj.contribution}
                  />
                </span>
                {idx !== 0 && (
                  <span
                    className="quarter remove-lender-contrib-pair-btn w3-center icon-btn w3-red w3-hover-pink"
                    title="Remove entry."
                    onClick={() => removeLenderContribPair(idx)}
                  >
                    -
                  </span>
                )}
              </span>
            </div>
          ))}

          <div
            className="w3-show w3-indigo w3-hover-shadow icon-cont icon-cont-center w3-center icon-btn w3-padding-small w3-small"
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
                Principal amount <span className="w3-text-red w3-small">*</span>
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="number"
                step="0.01"
                disabled
                id="amount"
                value={principalAmt}
                ref={principalAmountRef}
              />
            </div>
            <div className="w3-third">
              <label htmlFor="interest" className="w3-small text-overflow">
                Interest <span className="w3-text-red w3-small">*</span>
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="number"
                step="0.01"
                required
                id="interest"
                ref={interestRef}
              />
            </div>
          </div>
          <div className="w3-row">
            <div className="w3-half">
              <label htmlFor="period" className="w3-small text-overflow">
                Period (months) <span className="w3-text-red w3-small">*</span>
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="number"
                step="0.01"
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
                Withdrawals per month{" "}
                <span className="w3-text-red w3-small">*</span>
              </label>
              <input
                className="w3-input w3-center w3-border"
                type="number"
                step="1"
                required
                id="withdrawals-per-month"
                ref={withdrawalsPerMonthRef}
              />
            </div>
          </div>
          <div className="w3-row">
            <div className="w3-half">
              <label htmlFor="date-transfer" className="w3-small text-overflow">
                Date of transfer <span className="w3-text-red w3-small">*</span>
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
                Proof of transfer{" "}
                <span className="w3-text-red w3-small">*</span>
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
                Lender who transferred{" "}
                <span className="w3-text-red w3-small">*</span>
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
                Start period <span className="w3-text-red w3-small">*</span>
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
            <button className="w3-btn w3-teal w3-border">Submit</button>
          </p>
        </form>
      </Form>
    </>
  );
}

export default AddLoanForm;

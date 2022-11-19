import { useContext, useState } from "react";
import { MdOutlineAttachMoney, MdOutlineAdd } from "react-icons/md";

import Form from "./ui/Form";
import AppMetaContext from "../context/app-meta-context";

function AddLoanForm() {
  const appMetaContext = useContext(AppMetaContext);
  const [lenderContribPairs, setLenderContribPairs] = useState([]);

  function closeHandler() {
    appMetaContext.setIsAddLoanFormOpen(false);
  }

  function addLenderContribPair(event) {
    event.preventDefault();
    setLenderContribPairs((prevLenderContribPairs) =>
      prevLenderContribPairs.concat({ "": 0 })
    );
  }

  function submitHandler(event) {
    event.preventDefault();
  }

  return (
    <>
      <Form
        title="Add Loan Transaction."
        icon={MdOutlineAttachMoney}
        closeHandler={closeHandler}
      >
        <div>
          <label htmlFor="debtor" className="w3-small">
            Debtor
          </label>
          <input
            className="w3-input w3-center w3-border"
            type="text"
            required
            id="debtor"
          />
        </div>
        <div>
          <div className="w3-twothird">
            <label htmlFor="amount" className="w3-small">
              Principal amount
            </label>
            <input
              className="w3-input w3-center w3-border"
              type="number"
              required
              id="amount"
            />
          </div>
          <div className="w3-third">
            <label htmlFor="interest" className="w3-small">
              Interest
            </label>
            <input
              className="w3-input w3-center w3-border"
              type="number"
              required
              id="interest"
            />
          </div>
        </div>
        <div>
          <div className="w3-half">
            <label htmlFor="period" className="w3-small">
              Period (months)
            </label>
            <input
              className="w3-input w3-center w3-border"
              type="number"
              required
              id="period"
            />
          </div>
          <div className="w3-half">
            <label htmlFor="withdrawals-per-month" className="w3-small">
              Withdrawals per month
            </label>
            <input
              className="w3-input w3-center w3-border"
              type="number"
              required
              id="withdrawals-per-month"
            />
          </div>
        </div>
        <div>
          <div className="w3-half">
            <label htmlFor="date-transfer" className="w3-small">
              Date of transfer
            </label>
            <input
              className="w3-input w3-center w3-border"
              type="date"
              required
              id="date-transfer"
            />
          </div>
          <div className="w3-half">
            <label htmlFor="proof-transfer" className="w3-small">
              Proof of transfer
            </label>
            <input
              className="w3-input w3-center w3-border"
              type="file"
              required
              id="proof-transfer"
            />
          </div>
        </div>
        <div>
          <div className="w3-half">
            <label htmlFor="lender-transfer" className="w3-small">
              Lender who transferred
            </label>
            <input
              className="w3-input w3-center w3-border"
              type="text"
              required
              id="lender-transfer"
            />
          </div>
          <div className="w3-half">
            <label htmlFor="surety-debtor" className="w3-small">
              Surety debtor
            </label>
            <input
              className="w3-input w3-center w3-border"
              type="text"
              required
              id="surety-debtor"
            />
          </div>
        </div>
        <div>
          <div className="w3-half">
            <label htmlFor="start-period" className="w3-small">
              Start period
            </label>
            <input
              className="w3-input w3-center w3-border"
              type="text"
              required
              id="start-period"
            />
          </div>
          <div className="w3-half">
            <label htmlFor="contract-signed" className="w3-small">
              Contract signed
            </label>
            <input
              className="w3-input w3-center w3-border"
              type="file"
              required
              id="contract-signed"
            />
          </div>
        </div>
        <div>
          <div className="w3-half">
            <label htmlFor="ack-receipts" className="w3-small">
              Acknowledgment receipts
            </label>
            <input
              className="w3-input w3-center w3-border"
              type="file"
              required
              id="ack-receipts"
            />
          </div>
          <div className="w3-half">
            <label htmlFor="other-documents" className="w3-small">
              Other documents
            </label>
            <input
              className="w3-input w3-center w3-border"
              type="file"
              required
              id="other-documents"
            />
          </div>
        </div>
        <p className="w3-center">Lender Contributions</p>
        {lenderContribPairs.map((obj, idx) => (
          <div key={"lender-contrib-" + idx}>
            <div className="w3-twothird">
              <input
                className="w3-input w3-center w3-border"
                type="text"
                placeholder="Lender Name"
                required
              />
            </div>
            <div className="w3-third">
              <input
                className="w3-input w3-center w3-border"
                type="number"
                placeholder="Contribution"
                required
              />
            </div>
          </div>
        ))}

        <div
          className="w3-stretch icon-cont icon-cont-center icon-btn"
          onClick={addLenderContribPair}
        >
          <MdOutlineAdd />
          <span className="margin-left">Add Lender Contribution</span>
        </div>
        <p className="w3-center">
          <button className="w3-btn w3-black w3-border" onClick={submitHandler}>
            Submit
          </button>
        </p>
      </Form>
    </>
  );
}

export default AddLoanForm;

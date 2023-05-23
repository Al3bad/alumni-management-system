import { useState } from "react";
import { Formik, Form } from "formik";
import Modal from "../Modal/Modal";
import TextInput from "./../TextInput/TextInput";

import { verifyCertFormValidationSchema } from "./../../../common/validation";
import { verifyCertificate } from "../../lib/req";

import "./VerifyForm.scss";

// Components
interface IProps {
  setFormType: (formType: string) => void;
}

export default function VerifyForm({ setFormType }: IProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<any>();
  return (
    <div className="verify-page">
      <div className="certificate-verification-modal">
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          cancelStr="CLOSE"
          onCancel={() => setShowModal(false)}
        >
          {result?.invalid ? (
            <div className="">
              <h2 className="invalid">Certificate is invalid</h2>
            </div>
          ) : result?.valid ? (
            <div className="result">
              <h2 className="valid">Certificate is valid</h2>
              <p>
                The certificate was issued for{" "}
                <b>
                  {result.valid.fname} {result.valid.lname}
                </b>{" "}
                on <b>{result.valid.issuedate}</b>
              </p>
            </div>
          ) : (
            <p>Something wrong happend!</p>
          )}
        </Modal>
      </div>
      {errorMsg ? <p className="error-message">{errorMsg}</p> : null}
      <Formik
        initialValues={{
          certID: "",
        }}
        validationSchema={verifyCertFormValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          if (errorMsg) setErrorMsg("");
          try {
            const result = await verifyCertificate(values);
            console.log(result);
            setResult(result);
            setShowModal(true);
          } catch (error: any) {
            console.log(error);
            setErrorMsg(error);
          }
          setSubmitting(false);
        }}
      >
        <Form className="verify-form">
          <TextInput
            label="Certificate ID"
            name="certID"
            type="text"
            placeholder=""
          />
          <div className="buttons">
            <button
              className="secondary-btn home-btn"
              onClick={() => setFormType("")}
            >
              BACK
            </button>
            <button className="primary-btn submit-btn" type="submit">
              VERIFY
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

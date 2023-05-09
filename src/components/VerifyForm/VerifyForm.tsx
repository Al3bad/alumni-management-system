import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// Components
import TextInput from "./../TextInput/TextInput";

interface IProps {
  setFormType: (formType: string) => void;
}

export default function VerifyForm({ setFormType }: IProps) {
  const [errorMsg, setErrorMsg] = useState("");
  return (
    <div className="login-page">
      {errorMsg ? <p className="error-message">{errorMsg}</p> : null}
      <Formik
        initialValues={{
          lName: "",
          certID: "",
        }}
        validationSchema={Yup.object({
          lName: Yup.string()
            .trim()
            // .matches(
            //   /^s([\d]{7})$/,
            //   "Student ID must be in this format: s1234567"
            // )
            .required("Required"),
          certID: Yup.string().required("Required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          if (errorMsg) setErrorMsg("");
          try {
            const res = await fetch("http://localhost:3000" + "/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });
            if (res.status === 200) {
              // TODO: Show verification in a modal
              const data = await res.json();
              console.log(data);
            } else if (res.status === 404) {
              // TODO: Show message in a modal
              const data = await res.json();
              setErrorMsg(data.error.msg);
            } else {
              throw new Error(await res.text());
            }
          } catch (error: any) {
            console.error("An unexpected error happened occurred:", error);
            setErrorMsg("Something wrong happend. Please try again later!");
          }
          setSubmitting(false);
        }}
      >
        <Form className="login-form">
          <TextInput
            label="Last Name"
            name="lName"
            type="text"
            // placeholder="e.g. s1234567"
          />
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

import { useState } from "react";
import { Formik, Form } from "formik";
import { registerFormValidationSchema } from "./../../../common/validation";

// Components
import TextInput from "./../TextInput/TextInput";

import "./RegisterForm.scss";

interface IProps {
  setFormType: (formType: string) => void;
}

const apiURL = import.meta.env.VITE_API_URL;

const initialFormValues = {
  studentID: "",
  fname: "",
  lname: "",
  email: "",
  mobile: "",
  password: "",
  passwordConfirm: "",
};

export default function RegisterForm({ setFormType }: IProps) {
  const [errorMsg, setErrorMsg] = useState("");
  return (
    <div className="register-page">
      {errorMsg ? <p className="error-message">{errorMsg}</p> : null}
      <Formik
        initialValues={initialFormValues}
        validationSchema={registerFormValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          // TODO: Handle form submission
          console.log(values);
          if (errorMsg) setErrorMsg("");
          try {
            const res = await fetch(`${apiURL}/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
              credentials: "include",
            });
            console.log(res);
            if (res.status === 200) {
              // on success, redirect to user's page
              // const res2 = await fetch(`${apiURL}/check-auth`, {
              //   credentials: "include",
              // });
              // console.log(await res2.text());
            } else if (res.status === 400) {
              const { error } = await res.json();
              setErrorMsg(error.msg);
            } else {
              setErrorMsg("Somwthing wrong happend! Please try again later!");
            }
          } catch (error: any) {
            console.error("An unexpected error happened occurred:", error);
            setErrorMsg("Something wrong happend. Please try again later!");
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="register-form">
            <TextInput
              label="Student ID"
              name="studentID"
              type="text"
              placeholder="e.g. s1234567"
            />
            <TextInput
              label="First Name"
              name="fname"
              type="text"
              placeholder=""
            />
            <TextInput
              label="Last Name"
              name="lname"
              type="text"
              placeholder=""
            />
            <TextInput
              label="Email Address"
              name="email"
              type="email"
              placeholder=""
            />
            <TextInput
              label="Mobile Number"
              name="mobile"
              type="text"
              placeholder="e.g. 0412345678"
            />
            <TextInput
              label="Password"
              name="password"
              type="password"
              placeholder=""
            />
            <TextInput
              label="Confirm Password"
              name="passwordConfirm"
              type="password"
              placeholder=""
            />
            <div className="buttons">
              <button
                className="secondary-btn home-btn"
                onClick={() => setFormType("")}
              >
                BACK
              </button>
              <button
                className="primary-btn submit-btn"
                type="submit"
                disabled={isSubmitting}
              >
                REGISTER
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

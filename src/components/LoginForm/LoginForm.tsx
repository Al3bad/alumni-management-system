import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// Components
import TextInput from "./../TextInput/TextInput";

import "./LoginForm.scss";

interface IProps {
  setFormType: (formType: string) => void;
}

export default function LoginForm({ setFormType }: IProps) {
  const [errorMsg, setErrorMsg] = useState("");
  return (
    <div className="login-page">
      {errorMsg ? <p className="error-message">{errorMsg}</p> : null}
      <Formik
        initialValues={{
          studentId: "",
          password: "",
        }}
        validationSchema={Yup.object({
          studentId: Yup.string()
            .trim()
            .matches(
              /^s([\d]{7})$/,
              "Student ID must be in this format: s1234567"
            )
            .required("Required"),
          password: Yup.string().required("Required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          // TODO: Handle form submission
          console.log(values);
          if (errorMsg) setErrorMsg("");
          try {
            const res = await fetch("/api/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });
            if (res.status === 200) {
              // on success, redirect to user's page
            } else {
              throw new Error(await res.text());
            }
          } catch (error: any) {
            console.error("An unexpected error happened occurred:", error);
            console.log(error.message.length);
            if (error.message.length === 0)
              setErrorMsg("Something wrong happend. Please try again later!");
            else
              setErrorMsg(
                "Your Email/Password was incorrect. Please try again."
              );
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <TextInput
              label="Student ID"
              name="studentId"
              type="text"
              placeholder="e.g. s1234567"
            />
            <TextInput
              label="Password"
              name="password"
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
                LOGIN
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

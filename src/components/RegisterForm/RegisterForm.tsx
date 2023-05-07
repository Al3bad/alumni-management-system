import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// Components
import TextInput from "./../TextInput/TextInput";

interface IProps {
  setFormType: (formType: string) => void;
}

export default function RegisterForm({ setFormType }: IProps) {
  const [errorMsg, setErrorMsg] = useState("");
  return (
    <div className="login-page">
      {errorMsg ? <p className="error-message">{errorMsg}</p> : null}
      <Formik
        initialValues={{
          studentId: "",
          email: "",
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
          email: Yup.string()
            .email("Invalid email addresss")
            .required("Required"),
          password: Yup.string()
            .min(10)
            .matches(
              /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{10,}$/,
              "Password must contain lower-, uppercase, numbers, & special symbols"
            )
            .required("Required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          // TODO: Handle form submission
          if (errorMsg) setErrorMsg("");
          try {
            const res = await fetch("/api/register", {
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
        <Form className="login-form">
          <TextInput
            label="Student ID"
            name="studentId"
            type="text"
            placeholder="e.g. s1234567"
          />
          <TextInput
            label="Email Address"
            name="email"
            type="email"
            placeholder=""
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
            <button className="primary-btn submit-btn" type="submit">
              REGISTER
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

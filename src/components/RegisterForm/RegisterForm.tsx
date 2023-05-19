import { useState } from "react";
import { Formik, Form } from "formik";
import { registerFormValidationSchema } from "./../../../common/validation";
import { useAuth } from "../../context/authCtx";

// Components
import TextInput from "./../TextInput/TextInput";

import "./RegisterForm.scss";
import { useNavigate } from "react-router-dom";

interface IProps {
  setFormType: (formType: string) => void;
}

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
  const navigate = useNavigate();
  const auth = useAuth();
  return (
    <div className="register-page">
      {errorMsg ? <p className="error-message">{errorMsg}</p> : null}
      <Formik
        initialValues={initialFormValues}
        validationSchema={registerFormValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          if (errorMsg) setErrorMsg("");
          try {
            await auth.register(values);
            navigate("/profile");
          } catch (error: any) {
            setErrorMsg(error);
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

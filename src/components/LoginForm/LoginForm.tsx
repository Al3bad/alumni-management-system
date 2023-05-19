import { useState } from "react";
import { Formik, Form } from "formik";
import { loginFormValidationSchema } from "./../../../common/validation";
import { useAuth } from "../../context/authCtx";
import { useNavigate } from "react-router-dom";

// Components
import TextInput from "./../TextInput/TextInput";

import "./LoginForm.scss";

interface IProps {
  setFormType: (formType: string) => void;
  user: any;
  setUser: any;
}

const initialFormValues = {
  email: "",
  password: "",
};

export default function LoginForm({ setFormType }: IProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();
  return (
    <div className="login-page">
      {errorMsg ? <p className="error-message">{errorMsg}</p> : null}
      <Formik
        initialValues={initialFormValues}
        validationSchema={loginFormValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await auth.login(values);
            navigate("/profile");
          } catch (error: any) {
            setErrorMsg(error);
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <TextInput label="Email" name="email" type="text" placeholder="" />
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

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// Components
import TextInput from "./components/TextInput/TextInput";

// Assets & styles
import RMITLogo from "./assets/rmit-logo.svg";
import "./App.scss";

// Components
function App() {
  const [errorMsg, setErrorMsg] = useState("");
  return (
    <div className="login-page">
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string()
            .email("Invalid email addresss")
            .required("Required"),
          password: Yup.string().required("Required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          // TODO: Handle form submission
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
        <Form className="Login-form">
          <img className="logo" src={RMITLogo} alt="logo" />
          {errorMsg && <p className="error-message">{errorMsg}</p>}
          <TextInput
            label="Email Address"
            name="username"
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
            {/* <Link href="/"> */}
            <a className="secondary-btn home-btn">HOME</a>
            {/* </Link> */}
            <button className="primary-btn submit-btn" type="submit">
              LOGIN
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default App;

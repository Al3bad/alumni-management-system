// Modules & External Components
import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import VerifyForm from "./components/VerifyForm/VerifyForm";

// Styles & Assets
import "./App.scss";
import RMITLogo from "./assets/rmit-logo.svg";

/*
 * Notes: the purpose of this page is to collect user's information
 * for login/registeration/certificate id and send it to the server.
 */

//===============================================
// ==> Component
//===============================================
interface IProps {
  setFormType: (formType: string) => void;
}

const ButtonList = ({ setFormType }: IProps) => {
  return (
    <div className="btn-list">
      <button className="primary-btn" onClick={() => setFormType("login")}>
        Login
      </button>
      <button className="secondary-btn" onClick={() => setFormType("register")}>
        Register
      </button>
      <button className="secondary-btn" onClick={() => setFormType("verify")}>
        Verify Certificate
      </button>
    </div>
  );
};

export default function App() {
  const [formType, setFormType] = useState<string>("");
  return (
    <div className="home-page">
      <div className="container">
        <img className="logo" src={RMITLogo} alt="logo" />
        <h1>Alumni Managment System</h1>
        <hr
          style={{
            width: "100%",
            margin: "1rem 0",
            marginBottom: "2rem",
            border: "none",
            borderTop: "1px solid #ddd",
          }}
        />
        {formType === "login" ? (
          <LoginForm setFormType={setFormType} />
        ) : formType === "register" ? (
          <RegisterForm setFormType={setFormType} />
        ) : formType === "verify" ? (
          <VerifyForm setFormType={setFormType} />
        ) : (
          <ButtonList setFormType={setFormType} />
        )}
      </div>
    </div>
  );
}

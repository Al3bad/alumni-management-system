import { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import VerifyForm from "../../components/VerifyForm/VerifyForm";
import ButtonList from "../../components/ButtonList/ButtonList";
import RMITLogo from "./../../assets/rmit-logo.svg";
import "./Home.scss";

//===============================================
// ==> Component
//===============================================
export default function Home() {
  const [formType, setFormType] = useState<string>("");
  return (
    <div className="home-page">
      <div className="container">
        <img className="logo" src={RMITLogo} alt="logo" />
        <h1>Alumni Managment System</h1>
        <hr />
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

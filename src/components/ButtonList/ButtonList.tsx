//===============================================
// ==> Component
//===============================================
interface IProps {
  setFormType: (formType: string) => void;
}

export default function ButtonList({ setFormType }: IProps) {
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
}

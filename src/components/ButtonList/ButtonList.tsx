//===============================================
// ==> Component
//===============================================
interface IProps {
  setFormType: (formType: string) => void;
  user: any;
}

export default function ButtonList({ setFormType, user }: IProps) {
  console.log(user);
  return (
    <div className="btn-list">
      {!user ? (
        <button className="primary-btn" onClick={() => setFormType("login")}>
          Login
        </button>
      ) : null}
      <button className="secondary-btn" onClick={() => setFormType("register")}>
        Register
      </button>
      <button className="secondary-btn" onClick={() => setFormType("verify")}>
        Verify Certificate
      </button>
    </div>
  );
}

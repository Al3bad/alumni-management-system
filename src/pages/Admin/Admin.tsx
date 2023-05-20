import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authCtx";
import "./Admin.scss";

//===============================================
// ==> Component
//===============================================
export default function Admin() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const user = async () => {
      return await auth.getUser();
    };

    user().catch(() => navigate("/", { replace: true }));
  }, []);

  if (!auth.user) return <p>Loading ...</p>;
  else if (auth.user.info.role === "student")
    navigate("/alumni", { replace: true });

  const logout = () => {
    auth.logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="admin-profile-page">
      <div className="container">
        <div className="profile">
          <div className="avatar"></div>
          <div className="info">
            <div className="name">
              {auth.user.info.fname} {auth.user.info.lname}
            </div>
            <div className="student-id">a{auth.user.info.id}</div>
          </div>
          <button className="secondary-btn" onClick={logout}>
            LOGOUT
          </button>
        </div>
        <hr />
        {/* <ul className="doc-list">{docList}</ul> */}
      </div>
    </div>
  );
}

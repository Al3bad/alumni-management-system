import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authCtx";
import "./AlumniProfile.scss";

//===============================================
// ==> Component
//===============================================

export default function AlumniProfile() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const user = async () => {
      return await auth.getUser();
    };

    user().catch(() => navigate("/", { replace: true }));
  }, []);

  if (!auth.user) return null;

  const logout = () => {
    auth.logout();
    navigate("/", { replace: true });
  };

  const docList = auth.user.docs.map((docObj: any) => {
    return (
      <li>
        <span>Certificate [ID: {docObj.certID}]</span>
        {docObj.link ? <button className="">download</button> : null}
      </li>
    );
  });

  return (
    <div className="alumni-profile-page">
      <div className="container">
        <div className="profile">
          <div className="avatar"></div>
          <div className="info">
            <div className="name">
              {auth.user.info.fname} {auth.user.info.lname}
            </div>
            <div className="student-id">s{auth.user.info.studentnum}</div>
          </div>
          <button className="secondary-btn" onClick={logout}>
            LOGOUT
          </button>
        </div>
        <hr />
        <ul className="doc-list">{docList}</ul>
      </div>
    </div>
  );
}

// const AuthStatus = () => {
//   const auth = useAuth();
//   // const navigate = useNavigate(); for redirection
//
//   const logout = () => {
//     console.log("TODO: call /api/logout");
//   };
//
//   if (!auth.user) return <p>Please login! [TODO: redirect to home page]</p>;
//
//   return (
//     <p>
//       Welcome {auth.user}! <button onClick={logout}>Sign Out</button>
//     </p>
//   );
// };

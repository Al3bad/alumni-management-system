import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authCtx";

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

  return (
    <div className="alumni-profile-page">
      <p>
        Welcome {auth.user.fname} {auth.user.lname}!{" "}
        <button onClick={logout}>Sign Out</button>
      </p>
      <div className="doc-list">
        <ul>
          <li>
            <span>Certificate [hardcoded]</span> <a>download</a>
          </li>
          <li>
            <span>Transcript [hardcoded]</span> <a>download</a>
          </li>
        </ul>
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

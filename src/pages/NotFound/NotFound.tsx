import { useNavigate } from "react-router-dom";
import "./NotFound.scss";

export default function NotFound() {
  const navigate = useNavigate();

  const navigateToHomePage = () => navigate("/");

  return (
    <div className="not-found-page">
      <div className="container">
        <h1>404</h1>
        <h2>Page Not Found!</h2>
        <button className="primary-btn" onClick={navigateToHomePage}>
          HOME
        </button>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { logout} from "../services/authService";

export default function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {

    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      logout(refreshToken).catch((err) => {
        console.error("Logout failed:", err);
      });
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}

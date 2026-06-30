import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
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

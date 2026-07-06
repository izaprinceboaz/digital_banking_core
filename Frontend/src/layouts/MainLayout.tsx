import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import "./MainLayout.css";

export default function MainLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) logout(refreshToken).catch(console.error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-brand">Meridian</div>

        <div className="sidebar-links">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>Dashboard</NavLink>
          <NavLink to="/accounts" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>Accounts</NavLink>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>Transactions</NavLink>
          <NavLink to="/savings" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>Savings</NavLink>
          <NavLink to="/notifications" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>Notifications</NavLink>
        </div>

        <button className="sidebar-logout" onClick={handleLogout}>Log out</button>
      </nav>

      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}

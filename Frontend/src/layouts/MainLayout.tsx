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

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">M</span>
          Meridian
        </div>

        <div className="sidebar-links">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/accounts" className={linkClass}>Accounts</NavLink>
          <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
          <NavLink to="/savings" className={linkClass}>Savings</NavLink>
          <NavLink to="/statements" className={linkClass}>Statements</NavLink>
          <NavLink to="/notifications" className={linkClass}>Notifications</NavLink>
        </div>

        <button className="sidebar-logout" onClick={handleLogout}>Log out</button>
      </nav>

      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}

import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { logout } from "../services/authService";
import "./MainLayout.css";
import { useEffect, useState } from "react";
import { getMyNotifications } from "../services/notificationService";
import type { NotificationResponse } from "../types/notification";
import { getApiErrorMessage } from "../services/api";

function getUserInitial(): string {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return (user.firstName || user.email || "U").charAt(0).toUpperCase();
  } catch {
    return "U";
  }
}

export default function MainLayout() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loadError, setLoadError] = useState("");


  function handleLogout() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) logout(refreshToken).catch(console.error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "sidebar-link active" : "sidebar-link";

  useEffect(() => {
      getMyNotifications()
        .then(setNotifications)
        .catch((err) => setLoadError(getApiErrorMessage(err, "Couldn't load notifications.")));
    }, []);
  
    const unreadCount = notifications.filter((n) => !n.isRead).length;

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
        </div>

        <button className="sidebar-logout" onClick={handleLogout}>Log out</button>
      </nav>

      <main className="layout-content">
        <div className="topbar">

          {unreadCount > 0 ? (
            <Link to="/notifications" className="topbar-icon" aria-label="Notifications">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-bell-dot-icon lucide-bell-dot"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M11.68 2.009A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673c-.824-.85-1.678-1.731-2.21-3.348"/><circle cx="18" cy="5" r="3"/></svg>
          
            </Link>
          ) : (
                      
            <Link to="/notifications" className="topbar-icon" aria-label="Notifications">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
            </Link>

          )}
          <Link to="/profile" className="topbar-avatar" aria-label="Profile">
            {getUserInitial()}
          </Link>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

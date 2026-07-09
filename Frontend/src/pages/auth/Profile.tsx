import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import PageHeader from "../../components/PageHeader";
import type { UserResponse } from "../../types/auth";
import "./Profile.css";

function getStoredUser(): UserResponse | null {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

type Tab = "personal" | "notifications";

export default function Profile() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [tab, setTab] = useState<Tab>("personal");

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ")
    : "User";
  const initial = displayName.charAt(0).toUpperCase();

  function handleLogout() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) logout(refreshToken).catch(console.error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="page">
      <PageHeader
        title="Profile"
        action={
          <button className="btn btn--outline" onClick={handleLogout}>
            Log out
          </button>
        }
      />

      <div className="card" style={{ overflow: "hidden" }}>
        <div className="profile-tabs">
          <button
            className={`profile-tab${tab === "personal" ? " profile-tab--active" : ""}`}
            onClick={() => setTab("personal")}
          >
            Personal Information
          </button>
          <button
            className={`profile-tab${tab === "notifications" ? " profile-tab--active" : ""}`}
            onClick={() => setTab("notifications")}
          >
            Notification Preferences
          </button>
        </div>

        {tab === "personal" && (
          <div className="profile-body">
            <div className="profile-sidebar">
              <div className="profile-avatar">{initial}</div>
              <div className="profile-sidebar-title">My information</div>
              <p className="profile-sidebar-desc">
                Your personal details as registered with Meridian.
              </p>
            </div>
            <div className="profile-fields">
              <div className="profile-field">
                <span className="profile-field-label">First Name</span>
                <span className="profile-field-value">{user?.firstName || "—"}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Last Name</span>
                <span className="profile-field-value">{user?.lastName || "—"}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Email</span>
                <span className="profile-field-value">{user?.email || "—"}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Phone</span>
                <span className="profile-field-value">{user?.phoneNumber || "—"}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Role</span>
                <span className="profile-field-value">{user?.roles || "—"}</span>
              </div>
            </div>
          </div>
        )}

        {tab === "notifications" && (
          <div className="profile-body">
            <div className="profile-sidebar">
              <div className="profile-sidebar-title">Notification preferences</div>
              <p className="profile-sidebar-desc">
                Choose how and when you want to be notified about account activity.
              </p>
            </div>
            <div className="profile-fields">
              <p className="profile-empty">Not yet implemented.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

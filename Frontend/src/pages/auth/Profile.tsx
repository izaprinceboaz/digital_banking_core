import { useState } from "react";
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
  const user = getStoredUser();
  const [tab, setTab] = useState<Tab>("personal");
  const [isOn, setIsOn ] = useState(false);

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ")
    : "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="page">
      <PageHeader
        title="Profile"
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
              <div className="profile-field">
                <span  className="profile-field-label">Receive by Email</span>
                <span style={{cursor:"pointer"}} onClick = {() => setIsOn(prev => !prev)} className="profile-field-value">
                  { isOn ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-toggle-left-icon lucide-toggle-left"><circle cx="9" cy="12" r="3"/><rect width="20" height="14" x="2" y="5" rx="7"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-toggle-right-icon lucide-toggle-right"><circle cx="15" cy="12" r="3"/><rect width="20" height="14" x="2" y="5" rx="7"/></svg>
                  )}
                  </span>                 
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Receive By SMS</span>
                <span style={{cursor:"pointer"}} onClick = {() => setIsOn(prev => !prev)} className="profile-field-value">
                  { isOn ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-toggle-left-icon lucide-toggle-left"><circle cx="9" cy="12" r="3"/><rect width="20" height="14" x="2" y="5" rx="7"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-toggle-right-icon lucide-toggle-right"><circle cx="15" cy="12" r="3"/><rect width="20" height="14" x="2" y="5" rx="7"/></svg>
                  )}
                  </span>  
                </div>
            </div>
          </div>

        )}
      </div>
    </div>
  );
}

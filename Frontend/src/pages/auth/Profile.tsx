import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import type { UserResponse } from "../../types/auth";
import "./Profile.css";
import { getMyNotificationsPreference, saveMyNotificationPreference } from "../../services/notificationService"
import type { NotificationPreferenceResponse } from "../../types/notification";
import Button from "../../components/Button";
import Dialog from "../../components/Dialog";
import { updatePassword } from "../../services/authService";
import { getApiErrorMessage } from "../../services/api";
 
function getStoredUser(): UserResponse | null {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

type Tab = "personal" | "notifications";

type PrefToggleField =
  | "emailEnabled"
  | "smsEnabled"
  | "inAppEnabled"
  | "transactionAlerts"
  | "loginAlerts"
  | "interestAlerts";

const PREF_FIELDS: { field: PrefToggleField; label: string }[] = [
  { field: "emailEnabled", label: "Receive by Email" },
  { field: "smsEnabled", label: "Receive by SMS" },
  { field: "inAppEnabled", label: "In-app notifications" },
  { field: "transactionAlerts", label: "Transaction alerts" },
  { field: "loginAlerts", label: "Login alerts" },
  { field: "interestAlerts", label: "Interest alerts" },
];

function Toggle({ on }: { on: boolean }) {
  return on ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="7" fill="black" /><circle cx="15" cy="12" r="3" fill="white" /></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-toggle-left-icon lucide-toggle-left"><circle cx="9" cy="12" r="3"/><rect width="20" height="14" x="2" y="5" rx="7"/></svg>
  );
}

export default function Profile() {
  const user = getStoredUser();
  const [tab, setTab] = useState<Tab>("personal");
  const [prefs, setPrefs] = useState<NotificationPreferenceResponse | null>(null);

  const [pwOpen, setPwOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    getMyNotificationsPreference().then(setPrefs);
  }, []);

  function toggle(field: PrefToggleField) {
    setPrefs((prev) => (prev ? { ...prev, [field]: !prev[field] } : prev));
  }

  function openPwDialog() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPwError(null);
    setPwSuccess(false);
    setPwOpen(true);
  }

  async function savePassword() {
    setPwError(null);
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("The new passwords don't match.");
      return;
    }
    setPwSaving(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      setPwOpen(false);
      setPwSuccess(true);
    } catch (err) {
      setPwError(getApiErrorMessage(err, "Couldn't update your password. Try again."));
    } finally {
      setPwSaving(false);
    }
  }

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
                <span className="profile-field-label">Phone</span>
                <span className="profile-field-value">{user?.phoneNumber || "—"}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Role</span>
                <span className="profile-field-value">{user?.roles || "—"}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Email</span>
                <span className="profile-field-value">{user?.email || "—"}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Password</span>
                <span className="profile-field-value">**********</span>
                <button className="tl-edit" onClick={openPwDialog}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  Update Password
                </button>
              </div>
              {pwSuccess && (
                <div style={{ padding: "0 32px 16px" }}>
                  <p className="banner banner--success">Your password has been updated.</p>
                </div>
              )}
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
              {PREF_FIELDS.map(({ field, label }) => (
                <div className="profile-field" key={field}>
                  <span className="profile-field-label">{label}</span>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => toggle(field)}
                    className="profile-field-value"
                  >
                    <Toggle on={prefs?.[field] ?? false} />
                  </span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 32px" }}>
                <Button
                  type="button"
                  className="btn"
                  onClick={() => prefs && saveMyNotificationPreference(prefs)}
                  message="Save Preferences"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {pwOpen && (
        <Dialog title="Update password" onClose={() => setPwOpen(false)}>
          {pwError && <p className="banner banner--danger">{pwError}</p>}
          <div className="field">
            <label htmlFor="currentPassword">Current password</label>
            <input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="confirmPassword">Confirm new password</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
            <Button className="btn btn--outline" message="Cancel" onClick={() => setPwOpen(false)} disabled={pwSaving} />
            <Button className="btn" message={pwSaving ? "Saving…" : "Update password"} onClick={savePassword} disabled={pwSaving} />
          </div>
        </Dialog>
      )}
    </div>
  );
}

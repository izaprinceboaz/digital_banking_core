import { useEffect, useState } from "react";
import { deleteNotification, getMyNotifications, markNotificationAsRead } from "../../services/notificationService";
import type { NotificationResponse } from "../../types/notification";
import "./Notifications.css";
import PageHeader from "../../components/PageHeader";
import Dialog from "../../components/Dialog";
import { getApiErrorMessage } from "../../services/api";
import Button from "../../components/Button";

const GLYPHS: Record<string, string> = {
  TRANSFER: "↗",
  INTEREST: "%",
  SAVINGS: "◷",
  STATEMENT: "▤",
  SECURITY: "!",
};

function glyphFor(eventType: string): string {
  const key = Object.keys(GLYPHS).find((k) => eventType.toUpperCase().includes(k));
  return key ? GLYPHS[key] : "•";
}

function timeLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<NotificationResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getMyNotifications()
      .then(setNotifications)
      .catch((err) => setLoadError(getApiErrorMessage(err, "Couldn't load notifications.")));
  }, []);

  const isUnread = (n: NotificationResponse) => !n.isRead && !readIds.has(n.id);

  function markRead(id: string) {
    setReadIds((prev) => new Set(prev).add(id));
    markNotificationAsRead(id).catch(console.error);
  }

  const unreadList = notifications.filter(isUnread);
  const readList = notifications.filter((n) => !isUnread(n));
  const unread = unreadList.length;

  function renderRow(n: NotificationResponse) {
    const unreadItem = isUnread(n);
    return (
      <div
        key={n.id}
        className={`notif-row${unreadItem ? " notif-row--unread" : ""}`}
      >
        <div className={`notif-icon${unreadItem ? "" : " notif-icon--read"}`}>
          {glyphFor(n.eventType)}
        </div>
        <div className="notif-main" onClick={() => { setSelected(n); markRead(n.id); }}>
          <div className="notif-title-row">
            <span className="notif-title">{n.title}</span>
            {unreadItem && <span className="notif-dot" />}
          </div>
          <div className="notif-body">{n.message}</div>
        </div>
        <span className="notif-time">{timeLabel(n.createdAt)}</span>
        <svg onClick={() => {deleteNotification(n.id); setNotifications((prev) => prev.filter((item) => item.id !== n.id));}} style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : "You're all caught up"}
      />

      <Button
        message="Delete All"
        className="btn"
        onClick={() => {}}
      />

      {loadError && <p className="banner banner--danger">{loadError}</p>}

      <div className="card" style={{ overflow: "hidden" }}>
        {notifications.length === 0 && (
          <p className="notif-empty">Nothing here yet — you'll see account activity as it happens.</p>
        )}

        {unreadList.length > 0 && (
          <>
            <div className="notif-section-label">New</div>
            {unreadList.map(renderRow)}
          </>
        )}

        {readList.length > 0 && (
          <>
            <div className="notif-section-label">Earlier</div>
            {readList.map(renderRow)}
          </>
        )}
      </div>

      {selected && (
        <Dialog title="Notification details" onClose={() => setSelected(null)}>
          <div className="detail-row">
            <span className="detail-label">Type</span>
            <span className="detail-value">{selected.eventType}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Title</span>
            <span className="detail-value">{selected.title}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time</span>
            <span className="detail-value">{timeLabel(selected.createdAt)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Channel</span>
            <span className="detail-value">{selected.channel}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "8px 0" }}>
            <span className="detail-label">Message</span>
            <span style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text)" }}>
              {selected.message}
            </span>
          </div>
        </Dialog>
      )}
    </div>
  );
}

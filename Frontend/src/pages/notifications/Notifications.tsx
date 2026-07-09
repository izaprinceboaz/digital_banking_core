import { useEffect, useState } from "react";
import { getMyNotifications } from "../../services/notificationService";
import type { NotificationResponse } from "../../types/notification";
import { markNotificationAsRead } from "../../services/notificationService";
import "./Notifications.css";
import PageHeader from "../../components/PageHeader";
import Dialog from "../../components/Dialog";
import { getApiErrorMessage } from "../../services/api";

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
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<any | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getMyNotifications().then(setNotifications).catch((err) => setLoadError(getApiErrorMessage(err, "Couldn't load notifications.")));
  }, []);

  function markRead(id: string) {
    setReadIds((prev) => new Set(prev).add(id));
    markNotificationAsRead(id).catch(console.error);
  }

  const isUnread = (n: NotificationResponse) => !n.isRead && !readIds.has(n.id);
  const unread = notifications.filter(isUnread).length;

  const unreadList = notifications.filter(isUnread);
  const readList = notifications.filter((n) => !isUnread(n));


  return (
    <div className="page page--narrow">
      <PageHeader 
        title="Notifications" 
        subtitle={unread > 0 ? unread + " unread" : "You're all caught up"}
      />

      {loadError && <p className="banner banner--danger">{loadError}</p>}
      <div>
        {notifications.length === 0 && (
          <p className="notif-empty">Nothing here yet — you'll see account activity as it happens.</p>
        )}
        {unreadList.map((n) => (
          <div
            className={isUnread(n) ? "notif-row notif-row--unread" : "notif-row"}
            key={n.id}
            onClick={() => {
              setSelected(n); 
              markRead(n.id);}
            }
            style={{ cursor: "pointer" }}
          >
            <div className="notif-icon">{glyphFor(n.eventType)}</div>
            <div className="notif-main">
              <div className="notif-title-row">
                <span className="notif-title">{n.title}</span>
                {isUnread(n) && <span className="notif-dot" />}
              </div>
              <div className="notif-body">{n.message}</div>
            </div>
            <span className="notif-time">{timeLabel(n.createdAt)}</span>
          </div>
        ))}
        {readList.map((n) => (
          <div
            className={isUnread(n) ? "notif-row notif-row--unread" : "notif-row"}
            key={n.id}
            onClick={() => {
              setSelected(n); 
              markRead(n.id);}
            }
            style={{ cursor: "pointer" }}
          >
            <div className="notif-icon">{glyphFor(n.eventType)}</div>
            <div className="notif-main">
              <div className="notif-title-row">
                <span className="notif-title">{n.title}</span>
                {isUnread(n) && <span className="notif-dot" />}
              </div>
              <div className="notif-body">{n.message}</div>
            </div>
            <span className="notif-time">{timeLabel(n.createdAt)}</span>
          </div>
        ))}
        {selected && (
          <Dialog title="Notification details" onClose={() => setSelected(null)}>
            <div className="detail-row">
              <span className="detail-label">Reference</span>
              <span className="detail-value">{selected.id}</span>
            </div>
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
              <span className="detail-value" style={{ lineHeight: 1.6, color: "var(--text)" }}>
                {selected.message}
              </span>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
}

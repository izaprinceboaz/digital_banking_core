import { useEffect, useState } from "react";
import { getMyNotifications } from "../../services/notificationService";
import type { NotificationResponse } from "../../types/notification";
import { markNotificationAsRead } from "../../services/notificationService";
import "./Notifications.css";
import PageHeader from "../../components/PageHeader";

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

  useEffect(() => {
    getMyNotifications().then(setNotifications).catch(console.error);
  }, []);

  // TODO: backend has no mark-as-read endpoint yet — this is client-side only.
  function markAllRead() {
    setReadIds(new Set(notifications.map((n) => n.id)));
  }

  function markRead(id: string) {
    setReadIds((prev) => new Set(prev).add(id));
    markNotificationAsRead(id).catch(console.error);
  }

  const isUnread = (n: NotificationResponse) => !n.isRead && !readIds.has(n.id);
  const unread = notifications.filter(isUnread).length;

  return (
    <div className="page page--narrow">
      <PageHeader 
        title="Notifications" 
        subtitle={unread > 0 ? unread + " unread" : "You're all caught up"}
        action={<button className="btn btn--outline notif-mark-read" onClick={markAllRead}>
                  Mark all as read
                </button>}
      />

      <div className="card notif-list">
        {notifications.length === 0 && (
          <p className="notif-empty">Nothing here yet — you'll see account activity as it happens.</p>
        )}
        {notifications.map((n) => (
          <div
            className={isUnread(n) ? "notif-row notif-row--unread" : "notif-row"}
            key={n.id}
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
            {isUnread(n) && (
              <button onClick={() => markRead(n.id)} className="btn">
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

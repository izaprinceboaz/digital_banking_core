import { useEffect, useRef } from "react";
import "./ToastMessage.css";

interface Props {
  message?: string | null;
  variant?: "success" | "danger";
  onClose?: () => void;
  duration?: number;
}

export default function ToastMessage({ message, variant = "danger", onClose, duration = 4000 }: Props) {
  // keep the latest onClose without restarting the timer on every parent re-render
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onCloseRef.current?.(), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!message) return null;

  return (
    <div className={`toast toast--${variant}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}

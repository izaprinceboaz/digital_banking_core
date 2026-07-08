import type { ReactNode } from "react";

interface Props {
  className?: string;
  onClick?: () => void;
  message: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({className, onClick, message, type = "button", disabled}: Props) {
    return (
    <button 
        type={type} 
        className={`${className}`} 
        onClick={onClick} 
        disabled={disabled}
    >
        {message}

    </button>
    );
}
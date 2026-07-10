import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <div className="page-head">
      <div>
        <h2 className="page-title">{title}</h2>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

import { Link } from "react-router-dom";
import type { AccountResponse } from "../types/account";
import "./BankCard.css";
import formatMoney from "../utils/format";

interface Props {
  account: AccountResponse;
  index: number;
  linkTo?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function BankCard({ account, index, linkTo, onClick, style}: Props) {
  const className = `bank-card bank-card--${index % 3}`;
  const inner = (
    <>
      <div className="bank-card-top">
        <span className="bank-card-brand">Meridian</span>
        <span className="bank-card-type">{account.accountType}</span>
      </div>
      <div className="bank-card-balance">
        {formatMoney(account.currency, parseFloat(account.balance))}
      </div>
      <div className="bank-card-bottom">
        <span className="bank-card-number">•••• •••• {account.accountNumber.slice(-4)}</span>
        <span className="bank-card-currency">{account.currency}</span>
        <span className={`bank-card-status bank-card-status--${account.status.toLowerCase()}`}>
          <span className="bank-card-status-dot" />
          {account.status}
        </span>
      </div>
    </>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={className} onClick={onClick} style={style}>
      {inner}
    </div>
  );
}

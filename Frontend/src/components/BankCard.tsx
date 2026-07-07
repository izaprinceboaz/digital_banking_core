import { Link } from "react-router-dom";
import type { AccountResponse } from "../types/account";
import "./BankCard.css";

function formatMoney(currency: string, amount: number): string {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "RWF" ? 0 : 2,
      maximumFractionDigits: currency === "RWF" ? 0 : 2,
    }).format(amount);
  } catch {
    return currency + " " + amount.toLocaleString();
  }
}

interface Props {
  account: AccountResponse;
  index: number;
  linkTo?: string;
}

export default function BankCard({ account, index, linkTo }: Props) {
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

  return <div className={className}>{inner}</div>;
}

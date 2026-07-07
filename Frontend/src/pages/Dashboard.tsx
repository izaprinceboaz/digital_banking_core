import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyAccounts } from "../services/accountService";
import { findTransactionsByAccountNumber } from "../services/transactionService";
import type { AccountResponse } from "../types/account";
import "./Dashboard.css";

const ACTIONS = [
  { glyph: "↗", label: "Send", to: "/transactions" },
  { glyph: "+", label: "Top up", to: "/accounts" },
  { glyph: "≡", label: "Pay bills", to: "/transactions" },
  { glyph: "◷", label: "Save", to: "/savings" },
];

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

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export default function Dashboard() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    getMyAccounts()
      .then((data) => {
        setAccounts(data);
        if (data.length > 0) {
          localStorage.setItem("accountNumber", data[0].accountNumber);
          findTransactionsByAccountNumber(data[0].accountNumber)
            .then(setTransactions)
            .catch(console.error);
        }
      })
      .catch(console.error);
  }, []);

  const primary = accounts[0];
  // TODO: converting RWF/USD/EUR into one total needs an FX-rate source;
  // until then the headline shows the primary account's balance.
  const headline = primary
    ? formatMoney(primary.currency, parseFloat(primary.balance))
    : "—";
  const mask = (v: string) => (hidden ? "••••••••" : v);

  const dateStr = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="page dashboard">
      <div className="page-head">
        <div>
          <h2 className="page-title">{greeting()}</h2>
          <p className="page-sub">{dateStr}</p>
        </div>
        <div className="dash-avatar">M</div>
      </div>

      <div className="dash-hero">
        <div>
          <div className="dash-balance-label">
            Total balance
            <button className="dash-hide" onClick={() => setHidden(!hidden)}>
              {hidden ? "Show" : "Hide"}
            </button>
          </div>
          <div className="dash-balance num">{mask(headline)}</div>
          <div className="dash-balance-sub">
            across {accounts.length} account{accounts.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="dash-actions">
          {ACTIONS.map((a) => (
            <Link to={a.to} key={a.label} className="dash-action">
              <span className="dash-action-circle">{a.glyph}</span>
              <span className="dash-action-label">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="dash-cards">
        {accounts.map((account) => (
          <Link to="/accounts" key={account.accountNumber} className="dash-card card">
            <div className="dash-card-top">
              <span className="dash-chip">{account.currency}</span>
              <span className="dash-card-type">{account.accountType}</span>
            </div>
            <div>
              <div className="dash-card-balance num">
                {mask(formatMoney(account.currency, parseFloat(account.balance)))}
              </div>
              <div className="dash-card-number num">
                •••• {account.accountNumber.slice(-4)}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card dash-txns">
        <div className="dash-txns-head">
          <span className="card-title">Recent transactions</span>
          <Link to="/transactions" className="dash-see-all">See all</Link>
        </div>
        {transactions.length === 0 && (
          <p className="dash-empty">No transactions yet.</p>
        )}
        {transactions.slice(0, 6).map((t) => {
          const incoming = primary && t.receiverAccountNumber === primary.accountNumber;
          return (
            <div className="dash-txn" key={t.id}>
              <div className="dash-txn-icon">
                {(t.description || t.type || "?").slice(0, 1).toUpperCase()}
              </div>
              <div className="dash-txn-main">
                <div className="dash-txn-name">{t.description || t.type}</div>
                <div className="dash-txn-sub">{t.type}</div>
              </div>
              <div className="dash-txn-right">
                <div
                  className="dash-txn-amount num"
                  style={{ color: incoming ? "var(--success)" : "var(--text)" }}
                >
                  {incoming ? "+" : "−"}
                  {mask(formatMoney(t.currency, Math.abs(t.amount)))}
                </div>
                <div className="dash-txn-status">{t.status}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

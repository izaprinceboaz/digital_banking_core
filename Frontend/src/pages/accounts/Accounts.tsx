import { useState, useEffect } from "react";
import { createAccount, getMyAccounts } from "../../services/accountService";
import type { AccountResponse } from "../../types/account";
import "./Accounts.css";

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

export default function Accounts() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [accountType, setAccountType] = useState("SAVINGS");
  const [currency, setCurrency] = useState("RWF");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState<string | null>(null);

  function load() {
    getMyAccounts()
      .then((data) => {
        setAccounts(data);
        if (data.length > 0) {
          localStorage.setItem("accountNumber", data[0].accountNumber);
        }
      })
      .catch(console.error);
  }

  useEffect(load, []);

  async function handleCreateAccount() {
    setError(null);
    try {
      await createAccount({
        accountType,
        currency,
        balance: parseFloat(balance) || 0,
      });
      setShowForm(false);
      setBalance("");
      load();
    } catch {
      setError("Couldn't create the account. Try again.");
    }
  }

  const currencies = new Set(accounts.map((a) => a.currency)).size;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Accounts</h2>
          <p className="page-sub">
            {accounts.length} account{accounts.length === 1 ? "" : "s"} · {currencies}{" "}
            currenc{currencies === 1 ? "y" : "ies"}
          </p>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close" : "+ New account"}
        </button>
      </div>

      {showForm && (
        <div className="card card--pad">
          <div className="card-title accounts-form-title">Open a new account</div>
          {error && <p className="banner banner--danger accounts-form-error">{error}</p>}
          <div className="accounts-form-grid">
            <div className="field">
              <label htmlFor="accountType">Account type</label>
              <select
                id="accountType"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="SAVINGS">SAVINGS</option>
                <option value="WITHDRAWAL">WITHDRAWAL</option>
                <option value="DEPOSIT">DEPOSIT</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="RWF">RWF</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="balance">Opening balance</label>
              <input
                id="balance"
                type="number"
                placeholder="0"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>
            <button className="btn accounts-form-submit" onClick={handleCreateAccount}>
              Create
            </button>
          </div>
        </div>
      )}

      <div className="accounts-cards">
        {accounts.map((acc) => (
          <div className="card accounts-card" key={acc.accountNumber}>
            <div className="accounts-card-top">
              <span className="accounts-chip">{acc.currency}</span>
              <span className="accounts-status">
                <span className="accounts-status-dot" />
                {acc.status}
              </span>
            </div>
            <div>
              <div className="accounts-card-balance num">
                {formatMoney(acc.currency, parseFloat(acc.balance))}
              </div>
              <div className="accounts-card-type">{acc.accountType}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card accounts-table">
        <div className="accounts-row accounts-row--head">
          <span>Account number</span>
          <span className="accounts-cell-right">Balance</span>
          <span>Currency</span>
          <span>Type</span>
          <span>Status</span>
        </div>
        {accounts.map((acc) => (
          <div className="accounts-row" key={acc.accountNumber}>
            <span className="accounts-cell-strong num">{acc.accountNumber}</span>
            <span className="accounts-cell-strong accounts-cell-right num">
              {formatMoney(acc.currency, parseFloat(acc.balance))}
            </span>
            <span className="accounts-cell">{acc.currency}</span>
            <span className="accounts-cell">{acc.accountType}</span>
            <span>
              <span className="pill pill--success">{acc.status}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

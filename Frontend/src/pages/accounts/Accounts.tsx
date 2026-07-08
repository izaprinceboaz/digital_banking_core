import { useState, useEffect } from "react";
import { createAccount, getMyAccounts, updateAccountStatus } from "../../services/accountService";
import { getApiErrorMessage } from "../../services/api";
import type { AccountResponse } from "../../types/account";
import BankCard from "../../components/BankCard";
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
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [saving, setSaving] = useState(false);

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
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't create the account. Try again."));
    }
  }
  function openEdit(acc: AccountResponse) {
    setEditingAccount(acc.accountNumber);
    setEditStatus(acc.status);
  }

  function cancelEdit() {
    setEditingAccount(null);
    setEditStatus("");
  }

  async function saveEdit() {
    if (!editingAccount) return;
    setSaving(true);
    try {
      await updateAccountStatus(editingAccount, editStatus);
      cancelEdit();
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function statusPill(status: string) {
    if (status === "ACTIVE") return "pill pill--success";
    if (status === "SUSPENDED") return "pill pill--danger";
    return "pill";
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Accounts</h2>
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
        {accounts.map((acc, i) => (
          <BankCard key={acc.accountNumber} account={acc} index={i} />
        ))}
      </div>

      <div className="card accounts-table">
        <div className="accounts-row accounts-row--head">
          <span>Account number</span>
          <span className="accounts-cell-right">Balance</span>
          <span>Currency</span>
          <span>Type</span>
          <span>Status</span>
          <span></span>
        </div>
        {accounts.map((acc) => (
          <div key={acc.accountNumber}>
            <div className="accounts-row">
              <span className="accounts-cell-strong num">{acc.accountNumber}</span>
              <span className="accounts-cell-strong accounts-cell-right num">
                {formatMoney(acc.currency, parseFloat(acc.balance))}
              </span>
              <span className="accounts-cell">{acc.currency}</span>
              <span className="accounts-cell">{acc.accountType}</span>
              <span>
                <span className={statusPill(acc.status)}>{acc.status}</span>
              </span>
              <span>
                {editingAccount !== acc.accountNumber && (
                  <button
                    className="accounts-edit-btn"
                    onClick={() => openEdit(acc)}
                  >
                    Edit
                  </button>
                )}
              </span>
            </div>

            {editingAccount === acc.accountNumber && (
              <div className="accounts-edit-row">
                <div className="field accounts-edit-field">
                  <label>Status</label>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="FROZEN">FREEZE</option>
                    <option value="SUSPENDED">SUSPEND</option>
                    <option value="CLOSED">CLOSE</option>
                  </select>
                </div>
                <button className="btn accounts-edit-save" onClick={saveEdit} disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </button>
                <button className="btn btn--outline accounts-edit-cancel" onClick={cancelEdit} disabled={saving}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

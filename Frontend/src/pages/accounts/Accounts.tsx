import { useState, useEffect } from "react";
import { createAccount, getMyAccounts, updateAccountStatus, deleteAccount } from "../../services/accountService";
import { getApiErrorMessage } from "../../services/api";
import type { AccountResponse } from "../../types/account";
import BankCard from "../../components/BankCard";
import "./Accounts.css";
import formatMoney from "../../utils/format";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import Table from "../../components/Table";
import Dialog from "../../components/Dialog";
import { Link } from "react-router-dom";


export default function Accounts() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [accountType, setAccountType] = useState("SAVINGS");
  const [currency, setCurrency] = useState("RWF");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [confirmingClose, setConfirmingClose] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showBalance, setShowBalance] = useState(false);


  function load() {
    getMyAccounts()
      .then((data) => {
        setAccounts(data);
        if (data.length > 0) {
          localStorage.setItem("accountNumber", data[0].accountNumber);
        }
      })
      .catch((err) => setLoadError(getApiErrorMessage(err, "Couldn't load accounts.")));
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
  function resetActions() {
    setConfirmingClose(false);
    setEditError(null);
    setShowBalance(false);
  }

  async function toggleFreeze(acc: AccountResponse) {
    const next = acc.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setSaving(true);
    setEditError(null);
    try {
      const updated = await updateAccountStatus(acc.accountNumber, next);
      setSelected(updated);
      load();
    } catch (err) {
      setEditError(getApiErrorMessage(err, "Couldn't update the account. Try again."));
    } finally {
      setSaving(false);
    }
  }

  async function doClose(acc: AccountResponse) {
    setSaving(true);
    setEditError(null);
    try {
      await deleteAccount(acc.accountNumber);
      setSelected(null);
      setConfirmingClose(false);
      load();
    } catch (err) {
      setEditError(getApiErrorMessage(err, "Couldn't close the account. Try again."));
    } finally {
      setSaving(false);
    }
  }

  function statusPill(status: string) {
    if (status === "ACTIVE") return "pill pill--success";
    if (status === "SUSPENDED") return "pill pill--danger";
    return "pill";
  }

  const PAGE_SIZE = 10;
  const s = search.toLowerCase();
  const filteredAccounts = accounts.filter(
    (a) => !s || a.accountNumber.toLowerCase().includes(s) || a.accountType.toLowerCase().includes(s) || a.currency.toLowerCase().includes(s) || a.status.toLowerCase().includes(s) || parseFloat(a.balance).toFixed(2).includes(s)
  );
  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / PAGE_SIZE));
  const paginated = filteredAccounts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page">
      <PageHeader
        title="Accounts"
        action={<Button
                  className="btn"
                  onClick={() => setShowForm(!showForm)}
                  message={showForm ? "Close" : "+ New account"}/>}
      />
      {loadError && <p className="banner banner--danger">{loadError}</p>}

      {showForm && (
      <Dialog title="Create Account" onClose={() => { setShowForm(false); resetActions();}}>
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
          <Button 
                className="btn accounts-form-submit" 
                onClick={handleCreateAccount} 
                message="Create" 
          />
          </div>
      </Dialog>
      )}

      <div className="accounts-cards">
        {accounts.map((acc, i) => (
          <BankCard key={acc.accountNumber} account={acc} index={i} onClick={() => setSelected(acc)} style={{ cursor: "pointer" }}/>
        ))}
      </div>

      {accounts.length === 0 ? (
        <p className="accounts-empty">No accounts yet.</p>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="tbl-controls">
            <input
              className="tbl-search"
              placeholder="Search accounts…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          {paginated.length === 0 ? (
            <p className="accounts-empty">No results for "{search}".</p>
          ) : (
            <Table headers={["Account number", "Balance", "Currency", "Type", "Status"]}>
              {paginated.map((acc) => (
                <tr key={acc.accountNumber} onClick={() => setSelected(acc)} style={{ cursor: "pointer" }}>
                  <td>{acc.accountNumber}</td>
                  <td className="num">{formatMoney(acc.currency, parseFloat(acc.balance))}</td>
                  <td>{acc.currency}</td>
                  <td>{acc.accountType}</td>
                  <td>
                    <span className={statusPill(acc.status)}>{acc.status}</span>
                  </td>
                </tr>
              ))}
            </Table>
          )}
          {filteredAccounts.length > PAGE_SIZE && (
            <div className="tbl-pagination">
              <span>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredAccounts.length)} of {filteredAccounts.length}</span>
              <button className="tbl-page-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>←</button>
              <button className="tbl-page-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>→</button>
            </div>
          )}
        </div>
      )}
      {selected && (
        <Dialog title="Account details" onClose={() => { setSelected(null); resetActions(); }}>
          <div className="detail-row">
            <span className="detail-label">Account number</span>
            <span className="detail-value">{selected.accountNumber}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Balance</span>
            <span className="detail-value num" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {showBalance ? formatMoney(selected.currency, parseFloat(selected.balance)) : "••••••••"}
              <span style={{ cursor: "pointer", display: "inline-flex", color: "var(--text-muted)" }} onClick={() => setShowBalance((v) => !v)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </span>
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Currency</span>
            <span className="detail-value">{selected.currency}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Type</span>
            <span className="detail-value">{selected.accountType}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className={statusPill(selected.status)}>{selected.status}</span>
          </div>

          {editError && <p className="banner banner--danger" style={{ marginTop: 4 }}>{editError}</p>}

          {selected.status !== "CLOSED" && (
            confirmingClose ? (
              <div className="dialog-actions">
                <span>Close account {selected.accountNumber}? This can't be undone.</span>
                <Button className="btn btn--danger" onClick={() => doClose(selected)} disabled={saving} message={saving ? "…" : "Yes, close it"} />
                <Button className="btn btn--outline" onClick={() => setConfirmingClose(false)} disabled={saving} message="Cancel" />
              </div>
            ) : (
              <div className="dialog-actions">
                <Button
                  className="btn btn--outline"
                  onClick={() => toggleFreeze(selected)}
                  disabled={saving}
                  message={selected.status === "ACTIVE" ? "Freeze account" : "Unfreeze account"}
                />
                <Button
                  className="btn btn--danger"
                  onClick={() => setConfirmingClose(true)}
                  disabled={saving || parseFloat(selected.balance) !== 0}
                  message="Close account"
                />
              </div>
            )
          )}
          {selected.status !== "CLOSED" && parseFloat(selected.balance) !== 0 && (
            <p className="hint" style={{ marginTop: 4 }}>Balance must be zero to close this account.</p>
          )}

          <Link to="/accounts/statements" state={{ account: selected }} style={{ display: "inline-block", marginTop: 16 }}>
            See statements
          </Link>
          <Link to="/accounts/transfer-limits" state={{ account: selected }} style={{ display: "inline-block", marginTop: 16 }}>
            Transfer Limits
          </Link>
        </Dialog>
      )}
    </div>
  );
}

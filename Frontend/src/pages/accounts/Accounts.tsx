import { useState, useEffect } from "react";
import { createAccount, getMyAccounts, updateAccountStatus } from "../../services/accountService";
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
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);


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
  function openEdit(acc: AccountResponse) {
    setEditingAccount(acc.accountNumber);
    setEditStatus(acc.status);
  }

  function cancelEdit() {
    setEditingAccount(null);
    setEditStatus("");
    setEditError(null);
  }

  async function saveEdit() {
    if (!editingAccount) return;
    setSaving(true);
    setEditError(null);
    try {
      const updated = await updateAccountStatus(editingAccount, editStatus);
      setSelected(updated);
      cancelEdit();
      load();
    } catch (err) {
      setEditError(getApiErrorMessage(err, "Couldn't update status. Try again."));
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
            <Button 
                  className="btn accounts-form-submit" 
                  onClick={handleCreateAccount} 
                  message="Create" 
            />
          </div>
        </div>
      )}

      <div className="accounts-cards">
        {accounts.map((acc, i) => (
          <BankCard key={acc.accountNumber} account={acc} index={i} />
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
        <Dialog title="Account details" onClose={() => { setSelected(null); cancelEdit(); }}>
          <div className="detail-row">
            <span className="detail-label">Account number</span>
            <span className="detail-value">{selected.accountNumber}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Balance</span>
            <span className="detail-value num">{formatMoney(selected.currency, parseFloat(selected.balance))}</span>
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
            {editingAccount === selected.accountNumber ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} style={{ height: 32, fontSize: 13 }}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="FROZEN">FROZEN</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
                <button className="btn" style={{ height: 32, padding: "0 12px", fontSize: 13 }} onClick={saveEdit} disabled={saving}>{saving ? "…" : "Save"}</button>
                <button className="btn btn--outline" style={{ height: 32, padding: "0 12px", fontSize: 13 }} onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className={statusPill(selected.status)}>{selected.status}</span>
                <button className="btn btn--outline" style={{ height: 28, padding: "0 10px", fontSize: 12 }} onClick={() => openEdit(selected)}>Edit</button>
              </div>
            )}
          </div>
          {editError && <p className="banner banner--danger" style={{ marginTop: 4 }}>{editError}</p>}
          <Link to="/statements" state={{ account: selected }}>
            See statements
          </Link>
        </Dialog>
      )}
    </div>
  );
}

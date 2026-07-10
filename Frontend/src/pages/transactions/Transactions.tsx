import { useEffect, useState } from "react";
import { getMyAccounts } from "../../services/accountService";
import {
  findTransactionsByAccountNumber,
  transfer,
} from "../../services/transactionService";
import { getApiErrorMessage } from "../../services/api";
import type { AccountResponse } from "../../types/account";
import "./Transactions.css";
import formatMoney from "../../utils/format";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import Table from "../../components/Table";
import Dialog from "../../components/Dialog";
import cleanErrorMessage from "../../utils/cleanErrorMessage";


function statusPill(status: string): string {
  if (status === "COMPLETED") return "pill pill--success";
  if (status === "FAILED") return "pill pill--danger";
  return "pill pill--warning";
}

export default function Transactions() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("TRANSFER");
  const [currency, setCurrency] = useState("RWF");

  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getMyAccounts()
      .then((data) => {
        setAccounts(data);
        if (data.length > 0) setSelectedAccount(data[0].accountNumber);
      })
      .catch((err) => setLoadError(getApiErrorMessage(err, "Couldn't load data.")));
  }, []);

  useEffect(() => {
    if (!selectedAccount) return;
    setSearch("");
    setPage(1);
    const acc = accounts.find((a) => a.accountNumber === selectedAccount);
    if (acc) setCurrency(acc.currency);
    findTransactionsByAccountNumber(selectedAccount)
      .then(setTransactions)
      .catch((err) => setLoadError(getApiErrorMessage(err, "Couldn't load data.")));
  }, [selectedAccount, accounts]);

  async function handleTransfer() {
    const amt = parseFloat(amount) || 0;
    if (!receiverAccountNumber || amt <= 0) return;
    setError(null);
    setSent(false);
    setSending(true);
    try {
      const trxn = await transfer({
        senderAccountNumber: selectedAccount,
        receiverAccountNumber,
        amount: amt,
        type,
        description,
        currency,
      });
      if( trxn.status === "FAILED" ) {
        setError(cleanErrorMessage(trxn.failureReason) || "The transfer couldn't be completed.");
        setSent(false);
      } else {
        setSent(true);
        setReceiverAccountNumber(""); setAmount(""); setDescription("");
      }
      findTransactionsByAccountNumber(selectedAccount).then(setTransactions);
    } catch (err) {
      setError(getApiErrorMessage(err, "The transfer couldn't be sent. Try again."));
    } finally {
      setSending(false);
    }
  }

  const PAGE_SIZE = 10;
  const s = search.toLowerCase();
  const filtered = transactions.filter(
    (t) => !s || t.receiverAccountNumber?.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s) || t.status?.toLowerCase().includes(s) || t.amount?.toFixed(2).includes(s)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page">

      <PageHeader 
        title="Transactions" 
        action={<select
                    className="select-inline"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                  >
                    {accounts.map((a) => (
                      <option key={a.accountNumber} value={a.accountNumber}>
                        {a.accountNumber} ({a.currency} — {a.accountType})
                      </option>
                    ))}
                  </select>}
      />

      {loadError && <p className="banner banner--danger">{loadError}</p>}
      <div className="card card--pad">
        <div className="card-title txn-form-title">New transfer</div>
        {sent && (
          <p className="banner banner--success txn-form-banner">
            Transfer sent.
          </p>
        )}
        {error && <p className="banner banner--danger txn-form-banner">{error}</p>}        
        <div className="txn-form-grid">
          <div className="field">
            <label htmlFor="receiver">Receiver account number</label>
            <input
              id="receiver"
              placeholder="ACC-----"
              value={receiverAccountNumber}
              onChange={(e) => setReceiverAccountNumber(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="txnCurrency">Currency</label>
            <span
              className="txn-form-currency"
            >
              {currency}
            </span>
          </div>
        </div>
        <div className="txn-form-grid txn-form-grid--bottom">
          <div className="field">
            <label htmlFor="txnDescription">Description</label>
            <input
              id="txnDescription"
              placeholder="What's it for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="txnType">Type</label>
            <select id="txnType" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="TRANSFER">TRANSFER</option>
              <option value="PAYMENT">PAYMENT</option>
            </select>
          </div>
          <Button
                className="btn txn-form-submit"
                message={sending ? "Sending…" : "Send"}
                onClick={handleTransfer}
                disabled={sending}
          />
        </div>
      </div>

      <div className="card txn-table">
        <div className="txn-table-head">
          <span className="card-title">History</span>
          <input
            className="tbl-search"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        {transactions.length === 0 ? (
          <p className="txn-empty">No transactions on this account yet.</p>
        ) : paginated.length === 0 ? (
          <p className="txn-empty">No results for "{search}".</p>
        ) : (
          <Table headers={["Receiver", "Amount", "Description", "Currency", "Status"]}>
            {paginated.map((t) => {
              const incoming = t.receiverAccountNumber === selectedAccount;
              return (
                <tr key={t.id} onClick={() => setSelected(t)} style={{ cursor: "pointer" }}>
                  <td>{t.receiverAccountNumber}</td>
                  <td className="num">
                    {incoming ? "+" : "−"}
                    {formatMoney(t.currency, Math.abs(t.amount))}
                  </td>
                  <td>{t.description}</td>
                  <td>{t.currency}</td>
                  <td>
                    <span className={statusPill(t.status)}>{t.status}</span>
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
        {filtered.length > PAGE_SIZE && (
          <div className="tbl-pagination">
            <span>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
            <button className="tbl-page-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>←</button>
            <button className="tbl-page-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>→</button>
          </div>
        )}
        {selected && (
          <Dialog title="Transaction details" onClose={() => setSelected(null)}>
            <div className="detail-row">
              <span className="detail-label">Reference</span>
              <span className="detail-value num">{selected.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">From</span>
              <span className="detail-value num">{selectedAccount}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">To</span>
              <span className="detail-value num">{selected.receiverAccountNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount</span>
              <span className="detail-value num">{formatMoney(selected.currency, selected.amount)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Description</span>
              <span className="detail-value">{selected.description || "—"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span><span className={statusPill(selected.status)}>{selected.status}</span></span>
            </div>
            {selected.failureReason && (
              <div className="detail-row">
                <span className="detail-label">Failure reason</span>
                <span className="detail-value" style={{ color: "var(--danger)" }}>{cleanErrorMessage(selected.failureReason)}</span>
              </div>
            )}
          </Dialog>
          )}
      </div>
    </div>
  );
}

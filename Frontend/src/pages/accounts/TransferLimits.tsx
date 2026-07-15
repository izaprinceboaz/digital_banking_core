import { useEffect, useState } from "react";
import "./TransferLimits.css";
import formatMoney from "../../utils/format";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import Dialog from "../../components/Dialog";
import ToastMessage from "../../components/ToastMessage";
import { Link, useLocation } from "react-router-dom";
import { getMyTransferLimits, setMyTransferLimits } from "../../services/transactionService";
import { getApiErrorMessage } from "../../services/api";
import type { TransferLimitResponse } from "../../types/transaction";

type EditField = "daily" | "perTxn";

// Mirrors the backend's applyDefaultLimits — a custom limit can't be raised above these.
const DEFAULT_LIMITS: Record<string, { daily: number; perTxn: number }> = {
  USD: { daily: 5000, perTxn: 2000 },
  EUR: { daily: 5000, perTxn: 2000 },
};

function defaultsFor(currency: string) {
  return DEFAULT_LIMITS[currency] ?? { daily: 1000000, perTxn: 500000 };
}

export default function TransferLimits() {
  const location = useLocation();
  const account = (location.state as any)?.account;

  const [limit, setLimit] = useState<TransferLimitResponse | null>(null);
  const [editing, setEditing] = useState<EditField | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    if (!account) {
      setLoading(false);
      return;
    }
    getMyTransferLimits(account.accountNumber)
      .then((data: TransferLimitResponse) => setLimit(data))
      .catch((err) => setError(getApiErrorMessage(err, "Couldn't load transfer limits.")))
      .finally(() => setLoading(false));
  }, [account]);

  const currency = account?.currency ?? "";
  const editLabel = editing === "daily" ? "daily limit" : "limit per transaction";
  const editMax = editing ? defaultsFor(currency)[editing] : 0;

  function startEdit(field: EditField) {
    if (!limit) return;
    setEditing(field);
    setDraft(String(field === "daily" ? limit.dailyLimit : limit.perTxnLimit));
    setError(null);
    setSaved(false);
  }

  function closeEdit() {
    setEditing(null);
    setError(null);
  }

  async function saveEdit() {
    if (!limit || !editing) return;
    const value = parseFloat(draft);
    if (!(value > 0)) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (value > editMax) {
      setError(`This can't exceed the default of ${formatMoney(currency, editMax)}.`);
      return;
    }
    const daily = editing === "daily" ? value : limit.dailyLimit;
    const perTxn = editing === "perTxn" ? value : limit.perTxnLimit;
    if (perTxn > daily) {
      setError("The per-transaction limit can't be higher than the daily limit.");
      return;
    }

    setSaving(true);
    try {
      const updated = await setMyTransferLimits(account.accountNumber, {
        dailyLimit: daily,
        perTxnLimit: perTxn,
      });
      setLimit(updated);
      setEditing(null);
      setSaved(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "The limit couldn't be updated. Try again."));
    } finally {
      setSaving(false);
    }
  }

  function limitRow(field: EditField, title: string, value: number) {
    return (
      <div className="tl-row">
        <div>
          <div className="tl-row-title">{title}</div>
          <div className="tl-row-value num">{formatMoney(currency, value)}</div>
        </div>
        <button className="tl-edit" onClick={() => startEdit(field)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Link to=".." relative="path"> <strong>Accounts</strong> </Link> <span>{">"}</span>
        <div> Transfer Limits </div>
      </div>
      <PageHeader title="Set transaction limits" />

      {!account ? (
        <p className="banner banner--danger">
          Open transfer limits from an account to manage them.
        </p>
      ) : loading ? (
        <p className="stmt-empty">Loading…</p>
      ) : !limit ? (
        error && <p className="banner banner--danger">{error}</p>
      ) : (
        <div className="tl-grid">
          {/* Left — account + editable limits */}
          <div className="card card--pad tl-main">
            <ToastMessage message={saved ? "Limits updated." : null} variant="success" onClose={() => setSaved(false)} />
            <ToastMessage message={error} variant="danger" onClose={() => setError(null)} />

            <div className="tl-label">From</div>
            <div className="tl-account">
              <div className="tl-account-glyph">{account.accountType.slice(0, 2).toUpperCase()}</div>
              <div>
                <div className="tl-account-type">{account.accountType}</div>
                <div className="tl-account-number num">{account.accountNumber}</div>
              </div>
              <div className="tl-account-balance">
                <span>{currency}</span>
                <span className="num">
                  {showBalance ? formatMoney(currency, parseFloat(account.balance)) : "••••••••"}
                </span>
                <span className="tl-eye" onClick={() => setShowBalance((v) => !v)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </span>
              </div>
            </div>

            <hr className="tl-divider" />

            <div className="tl-label">Transaction limits</div>
            {limitRow("perTxn", "Limit per transaction", limit.perTxnLimit)}
            {limitRow("daily", "Daily limit", limit.dailyLimit)}
          </div>

          {/* Right — summary */}
          <div className="card card--pad tl-summary">
            <h3 className="tl-summary-title">Summary</h3>
            <div className="detail-row">
              <span className="detail-label">Account number</span>
              <span className="detail-value num">{account.accountNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Limit per transaction</span>
              <span className="detail-value num">{formatMoney(currency, limit.perTxnLimit)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Daily limit</span>
              <span className="detail-value num">{formatMoney(currency, limit.dailyLimit)}</span>
            </div>
          </div>
        </div>
      )}

      {editing && limit && (
        <Dialog title={`Edit ${editLabel}`} onClose={closeEdit}>
          <div className="field">
            <label htmlFor="limitInput">New {editLabel}{currency ? ` (${currency})` : ""}</label>
            <input
              id="limitInput"
              type="number"
              min="0"
              step="0.01"
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
            />
          </div>
          <p className="tl-hint">Cannot exceed the default of {formatMoney(currency, editMax)}.</p>
          <div className="tl-dialog-actions">
            <Button className="btn btn--outline" message="Cancel" onClick={closeEdit} disabled={saving} />
            <Button className="btn" message={saving ? "Saving…" : "Save"} onClick={saveEdit} disabled={saving} />
          </div>
        </Dialog>
      )}
    </div>
  );
}

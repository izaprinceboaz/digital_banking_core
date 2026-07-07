import { useEffect, useState } from "react";
import { getMyAccounts } from "../../services/accountService";
import { getMyStatements } from "../../services/accountService";
import type { StatementRow } from "../../services/accountService";
import type { AccountResponse } from "../../types/account";
import "./Statements.css";

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

export default function Statements() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [selected, setSelected] = useState("");
  const [rows, setRows] = useState<StatementRow[]>([]);

  useEffect(() => {
    getMyAccounts()
      .then((data) => {
        setAccounts(data);
        if (data.length > 0) setSelected(data[0].accountNumber);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selected) {
      getMyStatements(selected).then(setRows).catch(console.error);
    }
  }, [selected]);

  const account = accounts.find((a) => a.accountNumber === selected);

  return (
    <div className="page page--narrow">
      <div className="page-head">
        <div>
          <h2 className="page-title">Statements</h2>
          <p className="page-sub">{rows.length} transaction{rows.length === 1 ? "" : "s"} on this account</p>
        </div>
        <select
          className="select-inline"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {accounts.map((a) => (
            <option key={a.accountNumber} value={a.accountNumber}>
              {a.currency} account — {a.accountNumber}
            </option>
          ))}
        </select>
      </div>

      <div className="card stmt-table-wrap">
        <div className="stmt-table-row stmt-table-row--head">
          <span>Reference</span>
          <span>Description</span>
          <span>Type</span>
          <span className="stmt-cell-right">Amount</span>
          <span className="stmt-cell-right">Balance after</span>
        </div>
        {rows.length === 0 && (
          <p className="stmt-empty">No transactions on this account yet.</p>
        )}
        {rows.map((r) => (
          <div className="stmt-table-row" key={r.transactionRef}>
            <span className="stmt-ref num">{r.transactionRef}</span>
            <span className="stmt-desc">{r.description || "—"}</span>
            <span>
              <span className={r.entryType === "CREDIT" ? "pill pill--success" : "pill pill--danger"}>
                {r.entryType}
              </span>
            </span>
            <span
              className="stmt-cell-right num"
              style={{ color: r.entryType === "CREDIT" ? "var(--success)" : "var(--text)" }}
            >
              {r.entryType === "CREDIT" ? "+" : "−"}
              {account ? formatMoney(account.currency, Math.abs(r.amount)) : r.amount}
            </span>
            <span className="stmt-cell-right num stmt-balance-after">
              {account ? formatMoney(account.currency, r.balanceAfter) : r.balanceAfter}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

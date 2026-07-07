import { useEffect, useMemo, useState } from "react";
import { getMyAccounts } from "../../services/accountService";
import { findTransactionsByAccountNumber } from "../../services/transactionService";
import type { AccountResponse } from "../../types/account";
import "./Statements.css";

// TODO: there is no statements endpoint in the backend yet. Until one exists,
// this page groups the selected account's transactions by month client-side.

interface StatementRow {
  period: string;
  range: string;
  count: number;
}

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
  const [transactions, setTransactions] = useState<any[]>([]);

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
      findTransactionsByAccountNumber(selected)
        .then(setTransactions)
        .catch(console.error);
    }
  }, [selected]);

  const account = accounts.find((a) => a.accountNumber === selected);

  const statements: StatementRow[] = useMemo(() => {
    const byMonth = new Map<string, { count: number; date: Date }>();
    for (const t of transactions) {
      const d = t.createdAt ? new Date(t.createdAt) : new Date();
      const key = d.getFullYear() + "-" + d.getMonth();
      const entry = byMonth.get(key) ?? { count: 0, date: d };
      entry.count += 1;
      byMonth.set(key, entry);
    }
    return [...byMonth.values()]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map(({ count, date }) => {
        const period = date.toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
        });
        const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const month = date.toLocaleDateString("en-GB", { month: "short" });
        return { period, range: "1 – " + last + " " + month, count };
      });
  }, [transactions]);

  function handleDownload(period: string) {
    // TODO: wire to a statement-PDF endpoint when the backend provides one.
    window.alert("Statement download for " + period + " isn't available yet.");
  }

  return (
    <div className="page page--narrow">
      <div className="page-head">
        <div>
          <h2 className="page-title">Statements</h2>
          <p className="page-sub">Monthly statements for all your accounts</p>
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

      <div className="card stmt-list">
        {statements.length === 0 && (
          <p className="stmt-empty">No activity on this account yet.</p>
        )}
        {statements.map((s) => (
          <div className="stmt-row" key={s.period}>
            <div className="stmt-icon">▤</div>
            <div className="stmt-main">
              <div className="stmt-period">{s.period}</div>
              <div className="stmt-sub">
                {s.range} · {s.count} transaction{s.count === 1 ? "" : "s"}
              </div>
            </div>
            <div className="stmt-balance">
              <div className="stmt-balance-label">current balance</div>
              <div className="stmt-balance-value num">
                {account ? formatMoney(account.currency, parseFloat(account.balance)) : "—"}
              </div>
            </div>
            <button className="stmt-pdf" onClick={() => handleDownload(s.period)}>
              PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

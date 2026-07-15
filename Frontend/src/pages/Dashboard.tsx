import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyAccounts } from "../services/accountService";
import { findTransactionsByAccountNumber } from "../services/transactionService";
import type { AccountResponse } from "../types/account";
import BankCard from "../components/BankCard";
import "./Dashboard.css";
import formatMoney from "../utils/format";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table"
import Dialog from "../components/Dialog"
import ToastMessage from "../components/ToastMessage";
import { getApiErrorMessage } from "../services/api";
import type { TransactionResponse, TxnWithAccount } from "../types/transaction";

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export default function Dashboard() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [allTxns, setAllTxns] = useState<TxnWithAccount[]>([]);
  const [selected, setSelected] = useState<TransactionResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getMyAccounts().then((data) => {
      setAccounts(data);
      // fetch transactions for every account in parallel
      Promise.all(
        data.map((acc) =>
          findTransactionsByAccountNumber(acc.accountNumber)
            .then((txns) => txns.map((t) => ({ txn: t, account: acc })))
            .catch(() => [] as TxnWithAccount[])
        )
      ).then((results) => {
        const flat = results.flat().sort((a, b) =>
          (b.txn.createdAt || "").localeCompare(a.txn.createdAt || "")
        );
        setAllTxns(flat);
      });
    }).catch((err) => setLoadError(getApiErrorMessage(err, "Couldn't load your data.")));
  }, []);

  return (
    <div className="page dashboard">
      <PageHeader 
        title={greeting()} 
        subtitle="Here's your account overview"
      />

      <ToastMessage message={loadError} variant="danger" onClose={() => setLoadError(null)} />
      {/* Bank cards */}
      <div className="dash-cards">
        {accounts.length === 0 && (
          <p className="dash-empty">No accounts yet. <Link to="/accounts">Open one</Link></p>
        )}
        {accounts.map((account, i) => (
          <BankCard key={account.accountNumber} account={account} index={i} linkTo="/accounts" />
        ))}
      </div>

      {/* All transactions */}
      <div className="card dash-txns">
        <div className="dash-txns-head">
          <span className="card-title">Recent transactions</span>
          <Link to="/transactions" className="dash-see-all">See all</Link>
        </div>
        {allTxns.length === 0 ? (
          <p className="dash-empty">No transactions yet.</p>
        ) : (
          <Table headers={["Description", "Account", "Type", "Amount", "Status"]}>
          {allTxns.slice(0, 10).map(({ txn: t, account }) => {
            const incoming = t.receiverAccountNumber === account.accountNumber;
            return (
              <tr key={t.id} onClick={() => setSelected(t)} style={{ cursor: "pointer" }}>
                <td>{t.description || t.type}</td>
                <td className="num">{account.accountType} •••• {account.accountNumber.slice(-4)}</td>
                <td>{t.type}</td>
                <td className="num" style={{ color: incoming ? "var(--success)" : "var(--text)" }}>
                  {incoming ? "+" : "−"}{formatMoney(t.currency, Math.abs(t.amount))}
                </td>
                <td>
                  <span className={`pill pill--${t.status === "COMPLETED" ? "success" : t.status === "FAILED" ? "danger" : "warn"}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </Table>
        )}
        {selected && (
          <Dialog title="Transaction details" onClose={() => setSelected(null)}>
            <div className="detail-row">
              <span className="detail-label">Reference</span>
              <span className="detail-value num">{selected.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">To</span>
              <span className="detail-label">{selected.receiverAccountNumber}</span>
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
              <span className={`pill pill--${selected.status === "COMPLETED" ? "success" : selected.status === "FAILED" ? "danger" : "warn"}`}>{selected.status}</span>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
}

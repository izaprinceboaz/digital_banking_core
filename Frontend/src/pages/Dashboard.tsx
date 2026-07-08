import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyAccounts } from "../services/accountService";
import { findTransactionsByAccountNumber } from "../services/transactionService";
import type { AccountResponse } from "../types/account";
import BankCard from "../components/BankCard";
import "./Dashboard.css";
import formatMoney from "../utils/format";
import PageHeader from "../components/PageHeader";

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

interface TxnWithAccount {
  txn: any;
  account: AccountResponse;
}

export default function Dashboard() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [allTxns, setAllTxns] = useState<TxnWithAccount[]>([]);

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
    }).catch(console.error);
  }, []);

  return (
    <div className="page dashboard">
      <div className="page-head">
        <div>
          <h2 className="page-title">{greeting()}</h2>
          <p className="page-sub">Here's your account overview</p>
        </div>
        <div className="dash-avatar">M</div>
      </div>

      <PageHeader 
        title={greeting()} 
        subtitle="Here's your account overview"
      />

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
        {allTxns.length === 0 && (
          <p className="dash-empty">No transactions yet.</p>
        )}
        {allTxns.slice(0, 10).map(({ txn: t, account }) => {
          const incoming = t.receiverAccountNumber === account.accountNumber;
          return (
            <div className="dash-txn" key={t.id}>
              <div className="dash-txn-icon">
                {(t.description || t.type || "?").slice(0, 1).toUpperCase()}
              </div>
              <div className="dash-txn-main">
                <div className="dash-txn-name">{t.description || t.type}</div>
                <div className="dash-txn-sub">
                  {account.accountType} •••• {account.accountNumber.slice(-4)} · {t.type}
                </div>
              </div>
              <div className="dash-txn-right">
                <div className="dash-txn-amount num" style={{ color: incoming ? "var(--success)" : "var(--text)" }}>
                  {incoming ? "+" : "−"}{formatMoney(t.currency, Math.abs(t.amount))}
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

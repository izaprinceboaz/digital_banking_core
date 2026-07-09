import { useEffect, useState } from "react";
import { getMyAccounts } from "../../services/accountService";
import { getMyStatements } from "../../services/accountService";
import type { StatementRow } from "../../services/accountService";
import type { AccountResponse } from "../../types/account";
import "./Statements.css";
import formatMoney from "../../utils/format";
import PageHeader from "../../components/PageHeader";
import Table from "../../components/Table";
import Dialog from "../../components/Dialog";
import { useLocation } from "react-router-dom";


export default function Statements() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [selected, setSelected] = useState("");
  const [rows, setRows] = useState<StatementRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const location = useLocation();


  useEffect(() => {
    getMyAccounts()
      .then((data) => {
        setAccounts(data);
        const passed = (location.state as any)?.accountNumber;
        const match = data.find((a) => a.accountNumber === passed);
        if (match) {
          setSelected(match.accountNumber);
        } else if (data.length > 0) {
          setSelected(data[0].accountNumber);
        }
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
      <PageHeader 
        title="Statements" 
        action={<select 
                    className="select-inline"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}>
                      {accounts.map((a) => (
                        <option key={a.accountNumber} value={a.accountNumber}>
                          {a.currency} account — {a.accountNumber}
                        </option>
                      ))}
                </select>
                }
      />

      <div className="card stmt-table-wrap">
        {rows.length === 0 ? (
          <p className="stmt-empty">No transactions on this account yet.</p>
        ):(
          <Table headers={["Reference", "Type", "Description", "Amount", "Balance after"]}>
            {rows.map((r) => (
              <tr key={r.transactionRef} onClick={() => setSelectedRow(r)} style={{ cursor: "pointer" }}>
                <td>{r.transactionRef}</td>
                <td>
                  <span className={r.entryType === "CREDIT" ? "pill pill--success" : "pill pill--danger"}>
                    {r.entryType}
                  </span>
                </td>
                <td>{r.description}</td>
                <td>
                  <span
                    className="stmt-cell-right num"
                    style={{ color: r.entryType === "CREDIT" ? "var(--success)" : "var(--text)" }}
                  >
                    {r.entryType === "CREDIT" ? "+" : "−"}
                    {account ? formatMoney(account.currency, Math.abs(r.amount)) : r.amount}
                  </span>
                </td>
                <td>
                  {account ? formatMoney(account.currency, r.balanceAfter) : r.balanceAfter}
                </td>
              </tr>
          
            ))}
        </Table>
      )}
      {selectedRow && (
        <Dialog title="Transaction details" onClose={() => setSelectedRow(null)}>
          <div className="detail-row">
            <span className="detail-label">Reference</span>
            <span className="detail-value num">{selectedRow.transactionRef}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Type</span>
            <span className={selectedRow.entryType === "CREDIT" ? "pill pill--success" : "pill pill--danger"}>
              {selectedRow.entryType}
             </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Description</span>
            <span className="detail-value num">{selectedRow.description}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Reference</span>
            <span
              className="stmt-cell-right num"
              style={{ color: selectedRow.entryType === "CREDIT" ? "var(--success)" : "var(--text)" }}
            >
              {selectedRow.entryType === "CREDIT" ? "+" : "−"}
              {account ? formatMoney(account.currency, Math.abs(selectedRow.amount)) : selectedRow.amount}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Reference</span>
            <span className="detail-value num">{account ? formatMoney(account.currency, selectedRow.balanceAfter) : selectedRow.balanceAfter}</span>
          </div>
        </Dialog>
      )}
      </div>
    </div>
  );
}

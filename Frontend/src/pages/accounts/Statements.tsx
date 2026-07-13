import { useEffect, useState } from "react";
import "./Statements.css";
import formatMoney from "../../utils/format";
import PageHeader from "../../components/PageHeader";
import Table from "../../components/Table";
import Dialog from "../../components/Dialog";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loadStatements } from "../../store/statementsSlice";


export default function Statements() {
  const dispatch = useAppDispatch();
  const { rows, loading, error, loadedFor } = useAppSelector((state) => state.statements);
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const location = useLocation();

  const account = (location.state as any)?.account;

  useEffect(() => {
    if (account && account.accountNumber !== loadedFor) {
      dispatch(loadStatements(account.accountNumber));
    }
  }, [account, dispatch]);

  const PAGE_SIZE = 10;
  const s = search.toLowerCase();
  const filtered = rows.filter(
    (r) => !s || r.transactionRef?.toLowerCase().includes(s) || r.description?.toLowerCase().includes(s) || r.entryType?.toLowerCase().includes(s) || r.amount?.toFixed(2).includes(s)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page page--narrow">
      <PageHeader 
        title="Statements"
      />

      {error && <p className="banner banner--danger">{error}</p>}
      <div className="card stmt-table-wrap">
        <div className="tbl-controls">
          <input
            className="tbl-search"
            placeholder="Search statements…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        {loading ? (
          <p className="stmt-empty">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="stmt-empty">No transactions on this account yet.</p>
        ) : paginated.length === 0 ? (
          <p className="stmt-empty">No results for "{search}".</p>
        ) : (
          <Table headers={["Reference", "Type", "Description", "Amount", "Balance after"]}>
            {paginated.map((r) => (
              <tr key={r.transactionRef} onClick={() => setSelected(r)} style={{ cursor: "pointer" }}>
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
            <span className="detail-value num">{selected.transactionRef}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Type</span>
            <span className={selected.entryType === "CREDIT" ? "pill pill--success" : "pill pill--danger"}>
              {selected.entryType}
             </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Description</span>
            <span className="detail-value num">{selected.description}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Amount</span>
            <span
              className="stmt-cell-right num"
              style={{ color: selected.entryType === "CREDIT" ? "var(--success)" : "var(--text)" }}
            >
              {selected.entryType === "CREDIT" ? "+" : "−"}
              {account ? formatMoney(account.currency, Math.abs(selected.amount)) : selected.amount}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Balance After</span>
            <span className="detail-value num">{account ? formatMoney(account.currency, selected.balanceAfter) : selected.balanceAfter}</span>
          </div>
        </Dialog>
      )}
      </div>
    </div>
  );
}

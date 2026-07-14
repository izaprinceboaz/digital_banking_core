import { useEffect, useState } from "react";
import { getMyAccounts } from "../../services/accountService";
import { createSavingsPlan, findSavingsPlansByAccountNumber, deposit, withdraw, listInterestRecords } from "../../services/savingsService";
import { getApiErrorMessage } from "../../services/api";
import type { AccountResponse } from "../../types/account";
import type { SavingsPlanResponse, InterestRecordResponse } from "../../types/savings";
import "./Savings.css";
import formatMoney from "../../utils/format";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import ToastMessage from "../../components/ToastMessage";


function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function progressPct(plan: SavingsPlanResponse): number {
  if (!plan.maturityDate) return 0;
  const start = new Date(plan.startDate).getTime();
  const end = new Date(plan.maturityDate).getTime();
  if (end <= start) return 100;
  return Math.min(100, Math.max(0, ((Date.now() - start) / (end - start)) * 100));
}

function statusPill(status: string): string {
  if (status === "ACTIVE") return "pill pill--success";
  if (status === "MATURED") return "pill pill--warning";
  return "pill";
}

interface ActionState {
  planId: string;
  mode: "deposit" | "withdraw";
  amount: string;
  loading: boolean;
  error: string | null;
}

export default function Savings() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [savingsAccounts, setSavingsAccounts] = useState<AccountResponse[]>([]);
  const [plans, setPlans] = useState<SavingsPlanResponse[]>([]);
  const [records, setRecords] = useState<InterestRecordResponse[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [planName, setPlanName] = useState("");
  const [principal, setPrincipal] = useState("");
  const [compounding, setCompounding] = useState("MONTHLY");
  const [maturityDate, setMaturityDate] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const [action, setAction] = useState<ActionState | null>(null);

  async function loadPlans(accs: AccountResponse[]) {
    const all = await Promise.all(
      accs.map((a) => findSavingsPlansByAccountNumber(a.accountNumber).catch(() => []))
    );
    setPlans(all.flat());
  }

  useEffect(() => {
    getMyAccounts()
      .then((accs) => {
        setAccounts(accs);
        const savings = accs.filter((a) => a.accountType === "SAVINGS");
        setSavingsAccounts(savings);
        if (savings.length > 0) setSelectedAccount(savings[0].accountNumber);
        return loadPlans(accs);
      })
      .catch((err) => setLoadError(getApiErrorMessage(err, "Couldn't load data.")));
    listInterestRecords().then(setRecords).catch((err) => setLoadError(getApiErrorMessage(err, "Couldn't load data.")));
  }, []);

  async function handleCreate() {
    const amt = parseFloat(principal) || 0;
    if (!planName || amt <= 0 || !selectedAccount) return;
    setCreateError(null);
    try {
      await createSavingsPlan({
        accountNumber: selectedAccount,
        planName,
        compounding,
        principalAmount: amt,
        maturityDate: maturityDate || null,
      });
      setShowForm(false);
      setPlanName("");
      setPrincipal("");
      setMaturityDate("");
      loadPlans(accounts);
    } catch (err) {
      setCreateError(getApiErrorMessage(err, "Couldn't create the plan. Try again."));
    }
  }

  async function handleAction() {
    if (!action) return;
    const amt = parseFloat(action.amount) || 0;
    if (amt <= 0) return;
    const plan = plans.find((p) => p.id === action.planId);
    if (!plan) return;

    setAction((a) => a && { ...a, loading: true, error: null });
    try {
      if (action.mode === "deposit") {
        await deposit({ savingsPlanId: plan.id, accountNumber: plan.accountNumber, amount: amt });
      } else {
        await withdraw({ savingsPlanId: plan.id, accountNumber: plan.accountNumber, amount: amt });
      }
      setAction(null);
      loadPlans(accounts);
    } catch (err) {
      setAction((a) => a && { ...a, loading: false, error: getApiErrorMessage(err, "Action failed. Try again.") });
    }
  }

  const planName4 = (id: string) =>
    plans.find((p) => p.id === id)?.planName ?? "Savings plan";

  const active = plans.filter((p) => p.status === "ACTIVE").length;

  return (
    <div className="page">
      <PageHeader 
        title="Savings" 
        subtitle={`${active} active plan${active === 1 ? "" : "s"} · interest compounds automatically`}
        action={<Button 
                  className="btn"
                  message={showForm ? "Close" : "+ New plan"} 
                  onClick={() => setShowForm(!showForm)}
                />}
      />

      <ToastMessage message={loadError} variant="danger" onClose={() => setLoadError(null)} />
      {showForm && (
        <div className="card card--pad">
          <div className="card-title savings-form-title">Create a savings plan</div>
          {savingsAccounts.length === 0 ? (
            <p className="banner banner--danger savings-form-error">
              You need a SAVINGS account to create a plan. Open one in the Accounts tab first.
            </p>
          ) : (
            <>
              <ToastMessage message={createError} variant="danger" onClose={() => setCreateError(null)} />
              <div className="savings-form-grid">
                <div className="field">
                  <label htmlFor="savingsAccount">Account</label>
                  <select
                    id="savingsAccount"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                  >
                    {savingsAccounts.map((a) => (
                      <option key={a.accountNumber} value={a.accountNumber}>
                        {a.accountNumber} ({a.currency})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="planName">Plan name</label>
                  <input
                    id="planName"
                    placeholder="e.g. Emergency fund"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="principal">Principal</label>
                  <input
                    id="principal"
                    type="number"
                    placeholder="0"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="compounding">Compounding</label>
                  <select
                    id="compounding"
                    value={compounding}
                    onChange={(e) => setCompounding(e.target.value)}
                  >
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="QUARTERLY">QUARTERLY</option>
                    <option value="ANNUALLY">ANNUALLY</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="maturityDate">Maturity date</label>
                  <input
                    id="maturityDate"
                    type="date"
                    value={maturityDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setMaturityDate(e.target.value)}
                  />
                </div>
                <Button
                  className="btn savings-form-submit"
                  message="Create"
                  onClick={handleCreate}
                />
              </div>
            </>
          )}
        </div>
      )}

      <div className="savings-cards">
        {plans.length === 0 && (
          <p className="savings-empty">No savings plans yet — create your first one.</p>
        )}
        {plans.map((p) => {
          const earned = Math.max(0, p.currentBalance - p.principalAmount);
          const isActionOpen = action?.planId === p.id;
          const acc = accounts.find((a) => a.accountNumber === p.accountNumber);
          const currency = acc?.currency ?? "RWF";
          const isActive = p.status === "ACTIVE";
          const isMatured = p.status === "MATURED";

          return (
            <div className="card savings-card" key={p.id}>
              <div className="savings-card-top">
                <div>
                  <div className="savings-card-name">{p.planName}</div>
                  <div className="savings-card-meta">
                    {(p.interestRate * 100).toFixed(1)}% p.a. · {p.compounding} · matures{" "}
                    {formatDate(p.maturityDate)}
                  </div>
                </div>
                <span className={statusPill(p.status)}>{p.status}</span>
              </div>

              <div>
                <div className="savings-card-balance num">
                  {formatMoney(currency, p.currentBalance)}
                </div>
                <div className="savings-card-meta">
                  of {formatMoney(currency, p.principalAmount)} principal ·{" "}
                  {formatMoney(currency, earned)} interest earned
                </div>
              </div>

              <div className="savings-progress">
                <div
                  className={`savings-progress-fill${isMatured ? " savings-progress-fill--matured" : ""}`}
                  style={{ width: progressPct(p) + "%" }}
                />
              </div>

              {isMatured && (
                <p className="savings-matured-notice">
                  This plan matured — the full balance was credited back to your account.
                </p>
              )}

              {isActive && !isActionOpen && (
                <div className="savings-card-actions">
                  <Button 
                    className="btn savings-action"
                    message="Deposit"
                    onClick={() =>
                      setAction({ planId: p.id, mode: "deposit", amount: "", loading: false, error: null })
                    }
                  />
                  <Button 
                    className="btn btn--outline savings-action"
                    message="Withdraw"
                    onClick={() =>
                      setAction({ planId: p.id, mode: "withdraw", amount: "", loading: false, error: null })
                    }
                  />
                </div>
              )}

              {isActionOpen && (
                <div className="savings-action-inline">
                  <span className="savings-action-label">
                    {action!.mode === "deposit" ? "Deposit into" : "Withdraw from"} {p.planName}
                  </span>
                  {action!.error && (
                    <p className="banner banner--danger savings-action-error">{action!.error}</p>
                  )}
                  <div className="savings-action-row">
                    <input
                      className="savings-action-input"
                      type="number"
                      placeholder="0.00"
                      value={action!.amount}
                      onChange={(e) =>
                        setAction((a) => a && { ...a, amount: e.target.value })
                      }
                    />
                    <Button 
                          className="btn"
                          message={action!.loading ? "…" : "Confirm"}
                          onClick={handleAction}
                          disabled={action!.loading}
                    />
                    <Button 
                          className="btn btn--outline"
                          message="Cancel"
                          onClick={() => setAction(null)}
                          disabled={action!.loading}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="card savings-history">
        <div className="savings-history-head card-title">Interest history</div>
        {records.length === 0 && (
          <p className="savings-empty savings-empty--pad">No interest applied yet.</p>
        )}
        {records.map((r) => (
          <div className="savings-record" key={r.id}>
            <div className="savings-record-icon">%</div>
            <div className="savings-record-main">
              <div className="savings-record-name">{planName4(r.savingsPlanId)}</div>
              <div className="savings-record-sub">
                Interest applied ·{" "}
                {new Date(r.calculationDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="savings-record-amount num">+{formatMoney("RWF", r.interestEarned)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

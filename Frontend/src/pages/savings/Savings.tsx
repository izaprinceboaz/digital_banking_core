import { useEffect, useState } from "react";
import { getMyAccounts } from "../../services/accountService";
import {
  createSavingsPlan,
  findSavingsPlansByAccountNumber,
  deposit,
  withdraw,
  listInterestRecords,
} from "../../services/savingsService";
import type { AccountResponse } from "../../types/account";
import type { SavingsPlanResponse, InterestRecordResponse } from "../../types/savings";
import "./Savings.css";

function formatRwf(amount: number): string {
  return "RWF " + Math.round(amount).toLocaleString();
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

/** Progress from startDate to maturityDate, clamped 0–100. */
function progressPct(plan: SavingsPlanResponse): number {
  if (!plan.maturityDate) return 0;
  const start = new Date(plan.startDate).getTime();
  const end = new Date(plan.maturityDate).getTime();
  if (end <= start) return 100;
  return Math.min(100, Math.max(0, ((Date.now() - start) / (end - start)) * 100));
}

export default function Savings() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [plans, setPlans] = useState<SavingsPlanResponse[]>([]);
  const [records, setRecords] = useState<InterestRecordResponse[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [planName, setPlanName] = useState("");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [compounding, setCompounding] = useState("MONTHLY");
  const [error, setError] = useState<string | null>(null);

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
        return loadPlans(accs);
      })
      .catch(console.error);
    listInterestRecords().then(setRecords).catch(console.error);
  }, []);

  async function handleCreate() {
    const amt = parseFloat(principal) || 0;
    if (!planName || amt <= 0 || accounts.length === 0) return;
    setError(null);
    try {
      await createSavingsPlan({
        accountNumber: accounts[0].accountNumber,
        planName,
        interestRate: (parseFloat(rate) || 5) / 100,
        compounding,
        principalAmount: amt,
      });
      setShowForm(false);
      setPlanName("");
      setPrincipal("");
      setRate("");
      loadPlans(accounts);
    } catch {
      setError("Couldn't create the plan. Try again.");
    }
  }

  async function handleDeposit(plan: SavingsPlanResponse) {
    const raw = window.prompt("Amount to deposit into " + plan.planName + ":");
    const amt = parseFloat(raw || "");
    if (!amt || amt <= 0) return;
    await deposit({ savingsPlanId: plan.id, amount: amt }).catch(console.error);
    loadPlans(accounts);
  }

  async function handleWithdraw(plan: SavingsPlanResponse) {
    const raw = window.prompt("Amount to withdraw from " + plan.planName + ":");
    const amt = parseFloat(raw || "");
    if (!amt || amt <= 0) return;
    await withdraw({ savingsPlanId: plan.id, amount: amt }).catch(console.error);
    loadPlans(accounts);
  }

  const planName4 = (id: string) =>
    plans.find((p) => p.id === id)?.planName ?? "Savings plan";

  const active = plans.filter((p) => p.status === "ACTIVE").length;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Savings</h2>
          <p className="page-sub">
            {active} active plan{active === 1 ? "" : "s"} · interest compounds automatically
          </p>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close" : "+ New plan"}
        </button>
      </div>

      {showForm && (
        <div className="card card--pad">
          <div className="card-title savings-form-title">Create a savings plan</div>
          {error && <p className="banner banner--danger savings-form-error">{error}</p>}
          <div className="savings-form-grid">
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
              <label htmlFor="principal">Principal (RWF)</label>
              <input
                id="principal"
                type="number"
                placeholder="0"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="rate">Rate (% p.a.)</label>
              <input
                id="rate"
                type="number"
                placeholder="7.5"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
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
            <button className="btn savings-form-submit" onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>
      )}

      <div className="savings-cards">
        {plans.length === 0 && (
          <p className="savings-empty">No savings plans yet — create your first one.</p>
        )}
        {plans.map((p) => {
          const earned = Math.max(0, p.currentBalance - p.principalAmount);
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
                <span className="pill pill--success">{p.status}</span>
              </div>
              <div>
                <div className="savings-card-balance num">{formatRwf(p.currentBalance)}</div>
                <div className="savings-card-meta">
                  of {formatRwf(p.principalAmount)} principal · {formatRwf(earned)} interest
                  earned
                </div>
              </div>
              <div className="savings-progress">
                <div
                  className="savings-progress-fill"
                  style={{ width: progressPct(p) + "%" }}
                />
              </div>
              <div className="savings-card-actions">
                <button className="btn savings-action" onClick={() => handleDeposit(p)}>
                  Deposit
                </button>
                <button
                  className="btn btn--outline savings-action"
                  onClick={() => handleWithdraw(p)}
                >
                  Withdraw
                </button>
              </div>
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
            <div className="savings-record-amount num">+{formatRwf(r.interestEarned)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

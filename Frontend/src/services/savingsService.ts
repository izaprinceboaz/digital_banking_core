import api from "./api";
import type {
  SavingsPlanResponse,
  CreateSavingsPlanRequest,
  DepositRequest,
  WithdrawRequest,
  InterestRecordResponse,
} from "../types/savings";

// savings-service — SavingsPlanController (/api/savings-plans)

export async function createSavingsPlan(
  data: CreateSavingsPlanRequest
): Promise<SavingsPlanResponse> {
  const res = await api.post<SavingsPlanResponse>(`/api/savings-plans`, data);
  return res.data;
}

export async function findSavingsPlansByAccountNumber(
  accountNumber: string
): Promise<SavingsPlanResponse[]> {
  const res = await api.get<SavingsPlanResponse[]>(
    `/api/savings-plans/my-savings-plans/${accountNumber}`
  );
  return res.data;
}

export async function deposit(data: DepositRequest): Promise<SavingsPlanResponse> {
  const res = await api.post<SavingsPlanResponse>(`/api/savings-plans/deposit`, data);
  return res.data;
}

export async function withdraw(data: WithdrawRequest): Promise<SavingsPlanResponse> {
  const res = await api.post<SavingsPlanResponse>(`/api/savings-plans/withdraw`, data);
  return res.data;
}

export async function applyInterest(id: string): Promise<InterestRecordResponse> {
  const res = await api.post<InterestRecordResponse>(
    `/api/savings-plans/${id}/apply-interest`
  );
  return res.data;
}

export async function deleteSavingsPlan(id: string): Promise<void> {
  await api.delete(`/api/savings-plans/${id}`);
}

// savings-service — InterestRecordController (/api/interest-records)

export async function listInterestRecords(): Promise<InterestRecordResponse[]> {
  const res = await api.get<InterestRecordResponse[]>(`/api/interest-records`);
  return res.data;
}

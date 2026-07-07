export interface SavingsPlanResponse {
  id: string;
  accountNumber: string;
  planName: string;
  interestRate: number;
  compounding: "MONTHLY" | "QUARTERLY" | "ANNUALLY" | string;
  principalAmount: number;
  currentBalance: number;
  startDate: string;
  maturityDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavingsPlanRequest {
  accountNumber: string;
  planName: string;
  compounding: string;
  principalAmount: number;
  startDate?: string;
  maturityDate?: string | null;
}

export interface DepositRequest {
  savingsPlanId: string;
  accountNumber: string;
  amount: number;
}

export interface WithdrawRequest {
  savingsPlanId: string;
  accountNumber: string;
  amount: number;
}

export interface InterestRecordResponse {
  id: string;
  savingsPlanId: string;
  calculationDate: string;
  openingBalance: number;
  interestRate: number;
  interestEarned: number;
  closingBalance: number;
}

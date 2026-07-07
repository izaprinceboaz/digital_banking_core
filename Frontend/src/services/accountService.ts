import api from "./api";
import type { AccountResponse, CreateAccountRequest } from "../types/account";

export async function getMyAccounts(): Promise<AccountResponse[]> {
  const res = await api.get<AccountResponse[]>(`/api/accounts/my-accounts`);
  return res.data;
}

export async function getAccount(accountNumber: String): Promise<AccountResponse> {
  const res = await api.get<AccountResponse>(`/api/accounts/${accountNumber}`);
  return res.data;
}

export async function createAccount(data: CreateAccountRequest): Promise<AccountResponse> {
  const res = await api.post<AccountResponse>(`/api/accounts/create`, data);
  return res.data;
}

export async function updateBalance(accountNumber: String, data: String): Promise<AccountResponse> {
  const res = await api.post<AccountResponse>(`/api/accounts/${accountNumber}/update-balance`, data);
  return res.data;
}

export async function debit(accountNumber: String, data: String): Promise<AccountResponse> {
  const res = await api.post<AccountResponse>(`/api/accounts/${accountNumber}/debit`, data);
  return res.data;
}

export async function credit(accountNumber: String, data: String): Promise<AccountResponse> {
  const res = await api.post<AccountResponse>(`/api/accounts/${accountNumber}/credit`, data);
  return res.data;
}

export async function deleteAccount(accountNumber: String): Promise<any> {
  const res = await api.delete(`/api/accounts/${accountNumber}`);
  return res.data;
}

export interface StatementRow {
  transactionRef: string;
  description: string;
  amount: number;
  balanceAfter: number;
  entryType: "DEBIT" | "CREDIT";
}

export async function getMyStatements(accountNumber: string): Promise<StatementRow[]> {
  const res = await api.get<StatementRow[]>(`/api/statements/my-statements/${accountNumber}`);
  return res.data;
}
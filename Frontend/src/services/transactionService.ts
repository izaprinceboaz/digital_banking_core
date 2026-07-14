import api from "./api";
import type { TransferRequest, TransactionResponse} from "../types/transaction";

export async function createTransaction(data: any): Promise<TransactionResponse> {
  const res = await api.post<TransactionResponse>(`/api/transactions/create`, data);
  return res.data;
}

export async function findTransactionsByAccountNumber(accountNumber: string): Promise<TransactionResponse[]> {
  const res = await api.get<TransactionResponse[]>(`/api/transactions/my-transactions/${accountNumber}`);
  return res.data;
}

export async function getTransactionById(id: string) : Promise<TransactionResponse> {
    const res = await api.get<TransactionResponse>(`/api/transactions/${id}`);
    return res.data;
}

export async function transfer(data: TransferRequest): Promise<TransactionResponse> {
  const res = await api.post<TransactionResponse>(`/api/transactions/transfer`, data);
  return res.data;
}

export async function deleteTransaction(id: string): Promise<any> {
  const res = await api.delete(`/api/transactions/${id}`);
  return res.data;
}

export async function getMyTransferLimits(accountNumber: string): Promise<any> {
  const res = await api.get(`/api/transfer-limits/account/${accountNumber}`);
  return res.data
}

export async function setMyTransferLimits(accountNumber: string, data: any): Promise<any> {
  const res = await api.put(`/api/transfer-limits/account/${accountNumber}`, data);
  return res.data
}
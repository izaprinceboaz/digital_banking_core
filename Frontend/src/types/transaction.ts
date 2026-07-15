import type { AccountResponse } from "./account";

export interface TransactionResponse {
  id: string;
  referenceNumber: string;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  description: string;
  type: string;
  failureReason: string | null;
  status: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface TxnWithAccount {
  txn: TransactionResponse;
  account: AccountResponse;
}

export interface TransferRequest {
    senderAccountNumber: string;
    receiverAccountNumber: string;
    amount: number;
    description: string;
    type: string;
    currency: string;
}

export interface TransferLimitResponse {
  id: string;
  accountNumber: string;
  dailyLimit: number;
  perTxnLimit: number;
  dailyUsed: number;
  customized: boolean;
}

export interface SetTransferLimitRequest {
  dailyLimit: number;
  perTxnLimit: number;
}
export interface AccountResponse {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: string;
  currency: string;
  balance: string;
  status: string;
  createdAt: string;
}

export interface CreateAccountRequest {
  accountType: string;
  currency: string;
  balance: number;
}

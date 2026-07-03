export interface AccountResponse {
    id: string;
    userId: string;
    accountNumber: string;
    balance: string;
    currency: string;
    accountType: string;
    status: string;
}

export interface AccountRequest {
    accountType: string;
    currency: string;
    balance: number;
}

export interface TransactionResponse {
    id: string;
    receiverAccountNumber: string;
    amount: number;
    description: string;
    type: string;
    failureReason: string;
    status: string;
    currency: string;
}

export interface TransferRequest {
    senderAccountNumber: string;
    receiverAccountNumber: string;
    amount: number;
    description: string;
    type: string;
    currency: string;
}
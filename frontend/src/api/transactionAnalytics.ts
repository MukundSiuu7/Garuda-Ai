import api from "./api";

/*
==================================================
TRANSACTION
==================================================
*/

export interface TransactionRecord {
  transactionId: string;

  sender: string;

  receiver: string;

  amount: number;

  timestamp: string;

  locationId: string;

  category: string;
}

/*
==================================================
HIGH FREQUENCY
==================================================
*/

export interface HighFrequencyPattern {
  entity: string;

  transactionCount: number;

  period: string;
}

/*
==================================================
CIRCULAR TRANSACTIONS
==================================================
*/

export interface CircularPattern {
  entityA: string;

  entityB: string;

  transactionCount: number;

  totalAmount: number;
}

/*
==================================================
TRANSACTION SPIKE
==================================================
*/

export interface TransactionSpike {
  date: string;

  transactionCount: number;

  averageTransactions: number;
}

/*
==================================================
REPEATED TRANSFER
==================================================
*/

export interface RepeatedTransfer {
  sender: string;

  receiver: string;

  transactionCount: number;

  totalAmount: number;
}

/*
==================================================
DENSE CLUSTER
==================================================
*/

export interface DenseCluster {
  entity: string;

  connectedEntities: number;

  transactionCount: number;

  totalAmount: number;
}

/*
==================================================
SUMMARY
==================================================
*/

export interface TransactionSummary {
  totalTransactions: number;

  totalAmount: number;

  uniqueSenders: number;

  uniqueReceivers: number;
}

/*
==================================================
PATTERNS
==================================================
*/

export interface TransactionPatterns {
  highFrequency: HighFrequencyPattern[];

  circularTransactions: CircularPattern[];

  transactionSpikes: TransactionSpike[];

  repeatedTransfers: RepeatedTransfer[];

  denseClusters: DenseCluster[];
}

/*
==================================================
API RESPONSE
==================================================
*/

export interface TransactionAnalyticsData {
  summary: TransactionSummary;

  transactions: TransactionRecord[];

  patterns: TransactionPatterns;
}

/*
==================================================
GET TRANSACTION ANALYTICS
==================================================
*/

export const getTransactionAnalytics =
  async (): Promise<TransactionAnalyticsData> => {
    const response = await api.get<TransactionAnalyticsData>("/transactions");

    return response.data;
  };

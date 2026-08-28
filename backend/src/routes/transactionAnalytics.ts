import { Router } from "express";

import { Transaction } from "../models/models";

const router = Router();

/*
==================================================
TYPES
==================================================
*/

interface TransactionRecord {
  transactionId: string;
  sender: string;
  receiver: string;
  amount: number;
  timestamp: Date;
  locationId: string;
  category: string;
}

interface HighFrequencyPattern {
  entity: string;
  transactionCount: number;
  period: string;
}

interface CircularPattern {
  entityA: string;
  entityB: string;
  transactionCount: number;
  totalAmount: number;
}

interface TransactionSpike {
  date: string;
  transactionCount: number;
  averageTransactions: number;
}

interface RepeatedTransfer {
  sender: string;
  receiver: string;
  transactionCount: number;
  totalAmount: number;
}

interface DenseCluster {
  entity: string;
  connectedEntities: number;
  transactionCount: number;
  totalAmount: number;
}

/*
==================================================
GET TRANSACTION ANALYTICS
==================================================
*/

router.get("/", async (_req, res) => {
  try {
    /*
    ==============================================
    GET TRANSACTIONS
    ==============================================
    */

    const transactions = await Transaction.find()
      .sort({
        timestamp: 1,
      })
      .lean();

    /*
    ==============================================
    BASIC TRANSACTION DATA
    ==============================================
    */

    const transactionRecords: TransactionRecord[] = transactions.map(
      (transaction) => ({
        transactionId: transaction.transactionId,

        sender: transaction.sender,

        receiver: transaction.receiver,

        amount: transaction.amount,

        timestamp: transaction.timestamp,

        locationId: transaction.locationId,

        category: transaction.category,
      }),
    );

    /*
    ==============================================
    HIGH FREQUENCY
    ==============================================
    
    Rule:

    An entity making many transactions
    within the same day is marked as
    high-frequency activity.

    This is NOT a crime prediction.
    ==============================================
    */

    const dailyEntityMap = new Map<string, number>();

    transactionRecords.forEach((transaction) => {
      const date = new Date(transaction.timestamp).toISOString().split("T")[0];

      const senderKey = `${transaction.sender}_${date}`;

      const receiverKey = `${transaction.receiver}_${date}`;

      dailyEntityMap.set(
        senderKey,

        (dailyEntityMap.get(senderKey) ?? 0) + 1,
      );

      dailyEntityMap.set(
        receiverKey,

        (dailyEntityMap.get(receiverKey) ?? 0) + 1,
      );
    });

    const highFrequency: HighFrequencyPattern[] = [];

    dailyEntityMap.forEach((count, key) => {
      if (count >= 5) {
        const separator = key.lastIndexOf("_");

        const entity = key.substring(0, separator);

        const period = key.substring(separator + 1);

        highFrequency.push({
          entity,

          transactionCount: count,

          period,
        });
      }
    });

    /*
    ==============================================
    CIRCULAR TRANSACTIONS
    ==============================================

    Rule:

    A -> B and B -> A

    This identifies reciprocal transfer
    activity.

    It does NOT mean illegal activity.
    ==============================================
    */

    const pairMap = new Map<
      string,
      {
        forward: number;
        reverse: number;
        amount: number;
      }
    >();

    transactionRecords.forEach((transaction) => {
      const sender = transaction.sender;

      const receiver = transaction.receiver;

      const sorted = [sender, receiver].sort();

      const pairKey = `${sorted[0]}|${sorted[1]}`;

      const current = pairMap.get(pairKey) ?? {
        forward: 0,

        reverse: 0,

        amount: 0,
      };

      current.amount += transaction.amount;

      if (sender === sorted[0]) {
        current.forward++;
      } else {
        current.reverse++;
      }

      pairMap.set(pairKey, current);
    });

    const circularTransactions: CircularPattern[] = [];

    pairMap.forEach((value, key) => {
      if (value.forward > 0 && value.reverse > 0) {
        const [entityA, entityB] = key.split("|");

        circularTransactions.push({
          entityA,

          entityB,

          transactionCount: value.forward + value.reverse,

          totalAmount: value.amount,
        });
      }
    });

    /*
    ==============================================
    TRANSACTION SPIKES
    ==============================================
    */

    const dailyTransactionMap = new Map<string, number>();

    transactionRecords.forEach((transaction) => {
      const date = new Date(transaction.timestamp).toISOString().split("T")[0];

      dailyTransactionMap.set(
        date,

        (dailyTransactionMap.get(date) ?? 0) + 1,
      );
    });

    const dailyCounts = Array.from(dailyTransactionMap.values());

    const overallAverage =
      dailyCounts.length === 0
        ? 0
        : dailyCounts.reduce((total, value) => total + value, 0) /
          dailyCounts.length;

    const transactionSpikes: TransactionSpike[] = [];

    dailyTransactionMap.forEach((count, date) => {
      /*
        Spike rule:

        Daily count is at least
        2x the overall average.
        */

      if (overallAverage > 0 && count >= overallAverage * 2) {
        transactionSpikes.push({
          date,

          transactionCount: count,

          averageTransactions: Number(overallAverage.toFixed(2)),
        });
      }
    });

    /*
    ==============================================
    REPEATED TRANSFERS
    ==============================================

    Rule:

    Same sender -> same receiver
    occurring 3 or more times.
    ==============================================
    */

    const transferMap = new Map<
      string,
      {
        sender: string;
        receiver: string;
        count: number;
        amount: number;
      }
    >();

    transactionRecords.forEach((transaction) => {
      const key = `${transaction.sender}|${transaction.receiver}`;

      const current = transferMap.get(key) ?? {
        sender: transaction.sender,

        receiver: transaction.receiver,

        count: 0,

        amount: 0,
      };

      current.count++;

      current.amount += transaction.amount;

      transferMap.set(key, current);
    });

    const repeatedTransfers: RepeatedTransfer[] = [];

    transferMap.forEach((transfer) => {
      if (transfer.count >= 3) {
        repeatedTransfers.push({
          sender: transfer.sender,

          receiver: transfer.receiver,

          transactionCount: transfer.count,

          totalAmount: transfer.amount,
        });
      }
    });

    /*
    ==============================================
    DENSE TRANSACTION CLUSTERS
    ==============================================

    Rule:

    Entities connected to several
    different transaction counterparties.

    We calculate:

    - unique connections
    - transaction count
    - total amount
    ==============================================
    */

    const entityConnections = new Map<string, Set<string>>();

    const entityTransactionCount = new Map<string, number>();

    const entityAmount = new Map<string, number>();

    transactionRecords.forEach((transaction) => {
      if (!entityConnections.has(transaction.sender)) {
        entityConnections.set(
          transaction.sender,

          new Set(),
        );
      }

      if (!entityConnections.has(transaction.receiver)) {
        entityConnections.set(
          transaction.receiver,

          new Set(),
        );
      }

      entityConnections.get(transaction.sender)!.add(transaction.receiver);

      entityConnections.get(transaction.receiver)!.add(transaction.sender);

      entityTransactionCount.set(
        transaction.sender,

        (entityTransactionCount.get(transaction.sender) ?? 0) + 1,
      );

      entityTransactionCount.set(
        transaction.receiver,

        (entityTransactionCount.get(transaction.receiver) ?? 0) + 1,
      );

      entityAmount.set(
        transaction.sender,

        (entityAmount.get(transaction.sender) ?? 0) + transaction.amount,
      );

      entityAmount.set(
        transaction.receiver,

        (entityAmount.get(transaction.receiver) ?? 0) + transaction.amount,
      );
    });

    const denseClusters: DenseCluster[] = [];

    entityConnections.forEach((connections, entity) => {
      const transactionCount = entityTransactionCount.get(entity) ?? 0;

      const totalAmount = entityAmount.get(entity) ?? 0;

      /*
        Dense cluster rule:

        At least 4 different
        counterparties.
        */

      if (connections.size >= 4) {
        denseClusters.push({
          entity,

          connectedEntities: connections.size,

          transactionCount,

          totalAmount,
        });
      }
    });

    /*
    ==============================================
    SORT RESULTS
    ==============================================
    */

    highFrequency.sort((a, b) => b.transactionCount - a.transactionCount);

    circularTransactions.sort((a, b) => b.totalAmount - a.totalAmount);

    transactionSpikes.sort((a, b) => b.transactionCount - a.transactionCount);

    repeatedTransfers.sort((a, b) => b.transactionCount - a.transactionCount);

    denseClusters.sort((a, b) => b.connectedEntities - a.connectedEntities);

    /*
    ==============================================
    SUMMARY
    ==============================================
    */

    const totalAmount = transactionRecords.reduce(
      (total, transaction) => total + transaction.amount,

      0,
    );

    const uniqueSenders = new Set(
      transactionRecords.map((transaction) => transaction.sender),
    ).size;

    const uniqueReceivers = new Set(
      transactionRecords.map((transaction) => transaction.receiver),
    ).size;

    /*
    ==============================================
    RESPONSE
    ==============================================
    */

    res.status(200).json({
      summary: {
        totalTransactions: transactionRecords.length,

        totalAmount,

        uniqueSenders,

        uniqueReceivers,
      },

      transactions: transactionRecords,

      patterns: {
        highFrequency,

        circularTransactions,

        transactionSpikes,

        repeatedTransfers,

        denseClusters,
      },
    });
  } catch (error) {
    console.error("Transaction analytics error:", error);

    res.status(500).json({
      message: "Failed to calculate transaction analytics",
    });
  }
});

export default router;

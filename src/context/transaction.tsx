import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { database } from '../config/firebase.config';
import { ref, push, onValue, remove, serverTimestamp, query, orderByChild, equalTo } from 'firebase/database';
import dayjs from 'dayjs';
import { useAuth } from './auth';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  timestamp: number;
  monthKey: string;
  userId: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  allTransactions: Transaction[];
  addTransaction: (type: 'income' | 'expense', amount: number, description: string) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  isLoading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const getCurrentMonthKey = (): string => {
  return dayjs().format('YYYY-MM');
};

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    const currentMonth = getCurrentMonthKey();
    const transactionsRef = query(
      ref(database, 'transactions'),
      orderByChild('userId'),
      equalTo(user.id)
    );

    const unsubscribe = onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allTransactionList: Transaction[] = [];
        const monthlyTransactionList: Transaction[] = [];
        Object.keys(data).forEach((key) => {
          const transaction = data[key];
          const tx: Transaction = {
            id: key,
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            timestamp: transaction.timestamp,
            monthKey: transaction.monthKey,
            userId: transaction.userId,
          };
          allTransactionList.push(tx);
          // Filter by monthKey for monthly view
          if (transaction.monthKey === currentMonth) {
            monthlyTransactionList.push(tx);
          }
        });
        // Sort by timestamp descending (newest first)
        allTransactionList.sort((a, b) => b.timestamp - a.timestamp);
        monthlyTransactionList.sort((a, b) => b.timestamp - a.timestamp);
        setAllTransactions(allTransactionList);
        setTransactions(monthlyTransactionList);
      } else {
        setAllTransactions([]);
        setTransactions([]);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Firebase error:', error);
      setIsLoading(false);
    });

    return () => {
      // Unsubscribe is automatic when using onValue
    };
  }, [user]);

  const addTransaction = async (type: 'income' | 'expense', amount: number, description: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const monthKey = getCurrentMonthKey();
      await push(ref(database, 'transactions'), {
        type,
        amount,
        description,
        timestamp: serverTimestamp(),
        monthKey,
        userId: user.id,
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await remove(ref(database, `transactions/${id}`));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        allTransactions,
        addTransaction,
        deleteTransaction,
        totalIncome,
        totalExpense,
        balance,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

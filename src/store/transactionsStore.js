import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialTransactions } from '../data/mockData';

const useTransactionsStore = create(
  persist(
    (set, get) => ({
      transactions: initialTransactions,
      addTransaction: (newTx) => {
        // Security check for console users
        const role = localStorage.getItem('role-storage');
        const isAdmin = role && JSON.parse(role).state?.role === 'Admin';
        if (!isAdmin) {
          console.warn('Unauthorized action: Role is not Admin');
          return;
        }

        set((state) => ({
          transactions: [
            { ...newTx, id: newTx.id || Date.now(), date: newTx.date || new Date().toISOString().split('T')[0] },
            ...state.transactions,
          ],
        }));
      },
      deleteTransaction: (id) => {
        // Security check for console users
        const role = localStorage.getItem('role-storage');
        const isAdmin = role && JSON.parse(role).state?.role === 'Admin';
        if (!isAdmin) {
          console.warn('Unauthorized action: Role is not Admin');
          return;
        }

        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        }));
      },
      updateTransaction: (updatedTx) => {
        // Security check for console users
        const role = localStorage.getItem('role-storage');
        const isAdmin = role && JSON.parse(role).state?.role === 'Admin';
        if (!isAdmin) {
          console.warn('Unauthorized action: Role is not Admin');
          return;
        }

        set((state) => ({
          transactions: state.transactions.map((tx) => 
            tx.id === updatedTx.id ? { ...updatedTx } : tx
          ),
        }));
      },
      getStats: () => {
        const { transactions } = get();
        return {
          balance: transactions.reduce((acc, tx) => (tx.type === 'Income' ? acc + tx.amount : acc - tx.amount), 0),
          income: transactions.filter((tx) => tx.type === 'Income').reduce((acc, tx) => acc + tx.amount, 0),
          expenses: transactions.filter((tx) => tx.type === 'Expense').reduce((acc, tx) => acc + tx.amount, 0),
        };
      },
      getInsights: () => {
        const { transactions } = get();
        const expenses = transactions.filter((tx) => tx.type === 'Expense');
        const categoryTotals = expenses.reduce((acc, tx) => {
          acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
          return acc;
        }, {});
        const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
        return { topCategory };
      }
    }),
    {
      name: 'transactions-storage', 
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Data corrupted, resetting transactions store.', error);
          localStorage.removeItem('transactions-storage');
          window.location.reload();
        }
      }
    }
  )
);

export default useTransactionsStore;

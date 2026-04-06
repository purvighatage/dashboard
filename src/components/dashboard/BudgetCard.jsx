import React, { useMemo } from 'react';
import useTransactionsStore from '../../store/transactionsStore';

const BudgetCard = () => {
  const { transactions } = useTransactionsStore();

  const categoryBudgets = useMemo(() => {
    const limits = {
      'Food & Dining': 10000,
      'Housing': 25000,
      'Transport': 5000,
      'Salary': 100000,
      'Shopping': 8000,
      'Utilities': 4000,
      'Other': 5000
    };

    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    const spending = transactions
      .filter(tx => {
        const d = new Date(tx.date);
        return d.getMonth() === curMonth && d.getFullYear() === curYear && tx.type === 'Expense';
      })
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {});

    return Object.entries(limits).filter(([cat]) => cat !== 'Salary').map(([cat, limit]) => {
      const spent = spending[cat] || 0;
      const percent = Math.min((spent / limit) * 100, 100);
      return { cat, spent, limit, percent, isOver: spent > limit };
    });
  }, [transactions]);

  return (
    <div className="card-base budget-card animate-fade">
      <h3 className="stat-label">MONTHLY BUDGETS</h3>
      
      <div className="budget-list">
        {categoryBudgets.map(item => (
          <div key={item.cat} className="budget-item">
            <div className="budget-item-header">
              <span className="budget-cat">{item.cat}</span>
              <span className={`budget-amount ${item.isOver ? 'danger' : ''}`}>
                ₹{item.spent.toLocaleString()} / ₹{item.limit.toLocaleString()}
              </span>
            </div>
            <div className="progress-container-small">
              <div 
                className={`progress-bar-small ${item.isOver ? 'danger' : ''}`}
                style={{ width: `${item.percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <style jsx="true">{`
        .budget-card {
          padding: 24px;
        }

        .budget-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 16px;
        }

        .budget-item-header {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .budget-cat {
          font-weight: 600;
          color: var(--text-main);
        }

        .budget-amount {
          color: var(--text-muted);
          font-size: 12px;
        }

        .budget-amount.danger { color: var(--danger); font-weight: 700; }

        .progress-container-small {
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
        }
        
        .dark .progress-container-small { background: #1e1e1e; }

        .progress-bar-small {
          height: 100%;
          background: var(--primary);
          transition: width 1s ease-out;
        }

        .progress-bar-small.danger {
          background: var(--danger);
        }
      `}</style>
    </div>
  );
};

export default BudgetCard;

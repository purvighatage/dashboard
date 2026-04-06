import React from 'react';
import useTransactionsStore from '../../store/transactionsStore';

const SpendingHeatmap = () => {
  const { transactions } = useTransactionsStore();

  // Last 28 days (4 weeks)
  const getDates = () => {
    const dates = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const dates = getDates();
  const spendingByDay = transactions
    .filter(tx => tx.type === 'Expense')
    .reduce((acc, tx) => {
      acc[tx.date] = (acc[tx.date] || 0) + tx.amount;
      return acc;
    }, {});

  const getMaxSpending = () => {
    const values = Object.values(spendingByDay);
    return values.length > 0 ? Math.max(...values) : 1000;
  };

  const maxVal = getMaxSpending();

  const getIntensity = (val) => {
    if (!val) return 0;
    const ratio = val / maxVal;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  };

  return (
    <div className="card-base heatmap-card animate-fade">
      <h3 className="stat-label">ACTIVITY HEATMAP</h3>
      <div className="heatmap-grid">
        {dates.map(date => {
          const amount = spendingByDay[date] || 0;
          const level = getIntensity(amount);
          return (
            <div 
              key={date} 
              className={`heatmap-cell level-${level}`}
              title={`${date}: ₹${amount.toLocaleString()}`}
            ></div>
          );
        })}
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        <div className="heatmap-cell level-0"></div>
        <div className="heatmap-cell level-1"></div>
        <div className="heatmap-cell level-2"></div>
        <div className="heatmap-cell level-3"></div>
        <div className="heatmap-cell level-4"></div>
        <span>More</span>
      </div>

      <style jsx="true">{`
        .heatmap-card {
          padding: 24px;
        }

        .heatmap-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
          margin-top: 16px;
        }

        .heatmap-cell {
          aspect-ratio: 1;
          border-radius: 4px;
          background: var(--bg-main);
          transition: transform 0.2s;
        }

        .heatmap-cell:hover {
          transform: scale(1.2);
          z-index: 2;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .level-0 { background: #f1f5f9; }
        .level-1 { background: #e0e7ff; }
        .level-2 { background: #c7d2fe; }
        .level-3 { background: #818cf8; }
        .level-4 { background: #4f46e5; }
        
        .dark .level-0 { background: #1e1e1e; }

        .heatmap-legend {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 20px;
          font-size: 11px;
          color: var(--text-muted);
        }

        .heatmap-legend .heatmap-cell {
          width: 12px;
          height: 12px;
        }
      `}</style>
    </div>
  );
};

export default SpendingHeatmap;

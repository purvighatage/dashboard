import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import useTransactionsStore from '../../store/transactionsStore';

const COLORS = ['#9B7EBD', '#D4BEE4', '#A594F9', '#CDC1FF', '#FF9A9E', '#e2e8f0'];

const BreakdownChart = () => {
  const { transactions } = useTransactionsStore();

  const data = useMemo(() => {
    const expenses = transactions.filter(tx => tx.type === 'Expense');
    if (expenses.length === 0) return [];

    const grouped = expenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
      return acc;
    }, {});

    const sorted = Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], index) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        value,
        color: COLORS[index % COLORS.length]
      }));
      
    if (sorted.length > 5) {
      const top5 = sorted.slice(0, 5);
      const others = sorted.slice(5).reduce((acc, curr) => acc + curr.value, 0);
      return [...top5, { name: 'Other', value: others, color: '#cbd5e1' }];
    }
    
    return sorted;
  }, [transactions]);

  return (
    <div className="card-base chart-card animate-fade">
      <div className="card-header-row">
        <h3 className="stat-label">SPENDING BY CATEGORY</h3>
      </div>

      <div className="spending-legend-top">
        {data.map((entry) => (
          <div key={entry.name} className="legend-item-small">
            <span className="dot" style={{ background: entry.color }}></span>
            <span className="label">{entry.name}</span>
          </div>
        ))}
      </div>

      <div className="chart-body">
        {data.length === 0 ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No expenses recorded
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <style jsx="true">{`
        .spending-legend-top {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .legend-item-small {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-item-small .dot {
          width: 10px;
          height: 10px;
          border-radius: 3px;
        }

        .legend-item-small .label {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default BreakdownChart;

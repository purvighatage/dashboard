import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useTransactionsStore from '../../store/transactionsStore';

const TrendChart = () => {
  const { transactions } = useTransactionsStore();

  const data = useMemo(() => {
    if (transactions.length === 0) return [];
    
    // Reverse because transactions are fetched newest first
    const chronological = [...transactions].reverse();
    
    let currentBalance = 0;
    const monthlyAcc = {};
    
    chronological.forEach(tx => {
      currentBalance += tx.type === 'Income' ? Math.abs(tx.amount) : -Math.abs(tx.amount);
      const date = new Date(tx.date);
      const monthLabel = date.toLocaleString('default', { month: 'short' });
      // Keep assigning to monthLabel overwrites with the latest balance in that month
      monthlyAcc[monthLabel] = currentBalance;
    });
    
    const chartData = Object.entries(monthlyAcc).map(([month, balance]) => ({ month, balance }));
    
    // If only 1 data point, duplicate it so the area chart renders a line.
    if (chartData.length === 1) {
      chartData.push({ month: 'Now', balance: chartData[0].balance });
    }
    
    return chartData;
  }, [transactions]);

  return (
    <div className="card-base chart-card animate-fade" style={{ gridColumn: 'span 1' }}>
      <div className="card-header-row">
        <h3 className="stat-label">BALANCE TREND · 6 MONTHS</h3>
      </div>

      <div className="chart-body">
        {data.length === 0 ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No transactions yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }} 
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                tickFormatter={(value) => `₹${value / 1000}k`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-md)', padding: '12px' }}
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Balance']}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="var(--primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                dot={{ r: 6, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TrendChart;

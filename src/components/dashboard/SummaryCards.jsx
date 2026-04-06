import React, { useMemo } from 'react';
import useTransactionsStore from '../../store/transactionsStore';
import StatCard from '../common/StatCard';

const SummaryCards = () => {
  const { transactions, getStats } = useTransactionsStore();
  const stats = useMemo(() => getStats(), [transactions, getStats]);

  const formatRupee = (val) => `₹${Math.abs(val).toLocaleString()}`;

  return (
    <div className="stats-grid">
      <StatCard 
        label="NET BALANCE" 
        numericValue={stats.balance} 
        subValue="vs last month"
        trend="up"
        trendPercent="8"
        type="success"
      />
      <StatCard 
        label="INCOME" 
        numericValue={stats.income} 
        subValue="vs last month"
        trend="up"
        trendPercent="12"
        type="success"
      />
      <StatCard 
        label="EXPENSES" 
        numericValue={stats.expenses} 
        subValue="vs last month"
        trend="down"
        trendPercent="3"
        type="danger"
      />
    </div>
  );
};

export default SummaryCards;

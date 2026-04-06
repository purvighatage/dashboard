import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import SummaryCards from '../components/dashboard/SummaryCards';
import TrendChart from '../components/dashboard/TrendChart';
import BreakdownChart from '../components/dashboard/BreakdownChart';
import BudgetCard from '../components/dashboard/BudgetCard';
import SpendingHeatmap from '../components/dashboard/SpendingHeatmap';
import TransactionTable from '../components/transactions/TransactionTable';
import Skeleton from '../components/common/Skeleton';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate network latency for skeleton effect
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dashboard-content">
      <Header />
      
      {isLoading ? (
        <>
          <div className="stats-grid">
            {[1,2,3].map(i => <Skeleton key={i} height="160px" borderRadius="24px" />)}
          </div>
          <div className="main-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
            <Skeleton height="400px" borderRadius="24px" />
            <Skeleton height="400px" borderRadius="24px" />
          </div>
          <div className="main-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '32px' }}>
            <Skeleton height="400px" borderRadius="24px" />
            <Skeleton height="400px" borderRadius="24px" />
          </div>
        </>
      ) : (
        <>
          <SummaryCards />
          
          <div className="main-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            <TrendChart />
            <BreakdownChart />
          </div>

          <div className="main-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '32px' }}>
            <BudgetCard />
            <SpendingHeatmap />
          </div>

          <div className="bottom-section" style={{ marginTop: '32px' }}>
            <TransactionTable />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

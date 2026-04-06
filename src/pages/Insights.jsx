import React from 'react';
import FinanceInsights from '../components/dashboard/FinanceInsights';
import Header from '../components/common/Header';

const InsightsPage = () => {
  return (
    <div className="dashboard-content">
      <Header />
      <div className="main-content">
        <FinanceInsights />
      </div>
    </div>
  );
};

export default InsightsPage;

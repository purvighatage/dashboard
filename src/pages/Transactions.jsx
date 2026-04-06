import React from 'react';
import TransactionTable from '../components/transactions/TransactionTable';
import Header from '../components/common/Header';

const TransactionsPage = () => {
  return (
    <div className="dashboard-content">
      <Header />
      <div className="main-content">
        <TransactionTable />
      </div>
    </div>
  );
};

export default TransactionsPage;

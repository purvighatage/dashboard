import React, { useState, useMemo } from 'react';
import useTransactionsStore from '../../store/transactionsStore';
import useFilterStore from '../../store/filterStore';
import useRoleStore from '../../store/roleStore';
import { Plus } from 'lucide-react';
import AddTransactionModal from '../common/AddTransactionModal';
import Filters from './Filters';
import EditModal from './EditModal';

import useUIStore from '../../store/uiStore';

const TransactionTable = () => {
  const { transactions } = useTransactionsStore();
  const { role } = useRoleStore();
  const { searchQuery, filterType, filterCategory, setSearchQuery, setFilterType, setFilterCategory } = useFilterStore();
  const { isAddModalOpen, openAddModal, closeAddModal } = useUIStore();
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const filteredTransactions = (transactions || []).filter(tx => {
    const matchesSearch = tx.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    const matchesType = filterType === 'All' || tx.type === filterType;
    const matchesCategory = filterCategory === 'All' || tx.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  }).sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    return dateDiff !== 0 ? dateDiff : (b.id || 0) - (a.id || 0);
  });

  const groupedTransactions = useMemo(() => {
    const groups = {};
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    filteredTransactions.forEach(tx => {
      let groupLabel = tx.date;
      if (tx.date === today) groupLabel = 'Today';
      else if (tx.date === yesterday) groupLabel = 'Yesterday';
      else {
        const d = new Date(tx.date);
        const now = new Date();
        const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
        if (diffDays < 7) groupLabel = 'This Week';
        else groupLabel = 'Earlier';
      }

      if (!groups[groupLabel]) groups[groupLabel] = [];
      groups[groupLabel].push(tx);
    });
    return groups;
  }, [filteredTransactions]);

  return (
    <div className="transaction-card animate-fade">
      <div className="table-header-row">
        <h3 className="stat-label">RECENT TRANSACTIONS</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Filters />
          {role === 'Admin' && (
            <button className="primary-btn" onClick={openAddModal}>
              <Plus size={18} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      {(searchQuery || filterType !== 'All' || filterCategory !== 'All') && (
        <div className="filter-chips">
          {searchQuery && (
            <div className="filter-chip">
              Search: <strong>{searchQuery}</strong>
              <button onClick={() => setSearchQuery('')}>×</button>
            </div>
          )}
          {filterType !== 'All' && (
            <div className="filter-chip">
              Type: <strong>{filterType}</strong>
              <button onClick={() => setFilterType('All')}>×</button>
            </div>
          )}
          {filterCategory !== 'All' && (
            <div className="filter-chip">
              Category: <strong>{filterCategory}</strong>
              <button onClick={() => setFilterCategory('All')}>×</button>
            </div>
          )}
          <button className="clear-all-link" onClick={() => {
            setSearchQuery('');
            setFilterType('All');
            setFilterCategory('All');
          }}>Clear All</button>
        </div>
      )}

      <div className="table-responsive-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Name & Category</th>
              <th>Type</th>
              <th>Date</th>
              <th>Amount</th>
              {role === 'Admin' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              Object.entries(groupedTransactions).map(([group, txs]) => (
                <React.Fragment key={group}>
                  <tr className="group-header">
                    <td colSpan={role === 'Admin' ? 5 : 4}>{group}</td>
                  </tr>
                  {txs.map(tx => (
                    <tr 
                      key={tx.id} 
                      className={tx.type === 'Income' ? 'income-row' : 'expense-row'}
                      onClick={() => { if (role === 'Admin') setSelectedTransaction(tx); }} 
                      style={{ cursor: role === 'Admin' ? 'pointer' : 'default' }}
                    >
                      <td>
                        <div className="user-info">
                          <div className="user-avatar-placeholder">
                            {tx.name.charAt(0)}
                          </div>
                          <div className="name-cat">
                            <span className="user-name">{tx.name}</span>
                            <span className="user-category">{tx.category}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`type-badge ${tx.type.toLowerCase()}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="tx-date">{tx.date}</td>
                      <td className={`tx-amount ${tx.type.toLowerCase()}`}>
                        {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      {role === 'Admin' && (
                        <td>
                          <button 
                            className="secondary-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTransaction(tx);
                            }}
                          >
                            Details
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={role === 'Admin' ? 5 : 4} className="empty-state" style={{ textAlign: 'center', padding: '60px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                      {searchQuery ? `No transactions found for "${searchQuery}"` : 'No transactions found matching your criteria.'}
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {(searchQuery || filterType !== 'All' || filterCategory !== 'All') && (
                        <button className="secondary-btn" onClick={() => { 
                          setSearchQuery(''); 
                          setFilterType('All'); 
                          setFilterCategory('All'); 
                        }}>
                          Reset Filters
                        </button>
                      )}
                      {role === 'Admin' && searchQuery === '' && (
                        <button className="primary-btn" onClick={() => setIsAddModalOpen(true)}>
                          Add your first transaction
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && <AddTransactionModal onClose={closeAddModal} />}
      {selectedTransaction && (
        <EditModal 
          transaction={selectedTransaction} 
          onClose={() => setSelectedTransaction(null)} 
        />
      )}

      <style jsx="true">{`
        .table-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .transaction-table {
          width: 100%;
          border-collapse: collapse;
        }

        .transaction-table th {
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .transaction-table tr {
          border-left: 4px solid transparent;
          transition: all 0.2s;
        }

        .transaction-table tr:hover {
          background: rgba(155, 126, 189, 0.03);
          transform: translateX(4px);
        }

        .transaction-table tr.income-row {
          border-left-color: #67C3A7;
        }

        .transaction-table tr.expense-row {
          border-left-color: #FF7E7E;
        }

        .transaction-table td {
          padding: 16px;
          border-bottom: 1px solid #f9f9f9;
          font-size: 14px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar-placeholder {
          width: 40px;
          height: 40px;
          background: var(--secondary);
          color: var(--primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .name-cat {
          max-width: 200px;
          overflow: hidden;
        }

        .user-name {
          display: block;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-category {
          font-size: 12px;
          color: var(--text-muted);
        }

        .type-badge {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .type-badge.income { background: #E6F6F1; color: #2D9C75; }
        .type-badge.expense { background: #FFF0F0; color: #FF4D4D; }

        .tx-amount { font-weight: 700; font-size: 16px; white-space: nowrap; }
        .tx-amount.income { color: #2D9C75; }
        .tx-amount.expense { color: #FF4D4D; }

        .group-header td {
          background: #f8fafc;
          padding: 8px 16px;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 1px;
          border-bottom: 1px solid var(--border-color);
        }

        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
          align-items: center;
        }

        .filter-chip {
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-main);
        }

        .filter-chip strong {
          color: var(--primary);
        }

        .filter-chip button {
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          line-height: 1;
        }

        .filter-chip button:hover {
          color: var(--danger);
        }

        .clear-all-link {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 12px;
          text-decoration: underline;
          cursor: pointer;
        }

        .clear-all-link:hover {
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default TransactionTable;

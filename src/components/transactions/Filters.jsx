import React, { useEffect, useRef } from 'react';
import { Search, Filter as FilterIcon, Download } from 'lucide-react';
import useFilterStore from '../../store/filterStore';
import useTransactionsStore from '../../store/transactionsStore';
import useToastStore from '../../store/toastStore';

const Filters = () => {
  const { searchQuery, setSearchQuery, filterType, setFilterType, filterCategory, setFilterCategory } = useFilterStore();
  const { transactions } = useTransactionsStore();
  const { addToast } = useToastStore();
  const searchInputRef = useRef(null);

  const categories = ['All', ...new Set(transactions.map(tx => tx.category))];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExport = (format) => {
    const data = transactions.map(({ id, ...rest }) => rest);
    let blob;
    let filename = `fintrack_export_${new Date().toISOString().split('T')[0]}`;

    if (format === 'json') {
      blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      filename += '.json';
    } else {
      const headers = ['Name', 'Category', 'Type', 'Amount', 'Date'];
      const csvContent = [
        headers.join(','),
        ...data.map(tx => [
          `"${tx.name}"`,
          `"${tx.category}"`,
          `"${tx.type}"`,
          tx.amount,
          tx.date
        ].join(','))
      ].join('\n');
      blob = new Blob([csvContent], { type: 'text/csv' });
      filename += '.csv';
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    addToast(`Exported as ${format.toUpperCase()}`, 'success');
  };

  return (
    <div className="table-actions">
      <div className="search-box">
        <Search size={16} />
        <input 
          ref={searchInputRef}
          type="text" 
          placeholder="Search... (/)" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-box">
        <FilterIcon size={16} />
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      <div className="filter-box">
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="export-dropdown">
        <button className="secondary-btn icon-only" title="Export Data">
          <Download size={18} />
        </button>
        <div className="export-menu">
          <button onClick={() => handleExport('csv')}>Export CSV</button>
          <button onClick={() => handleExport('json')}>Export JSON</button>
        </div>
      </div>

      <style jsx="true">{`
        .icon-only {
          padding: 10px;
          border-radius: 12px;
        }

        .export-dropdown {
          position: relative;
        }

        .export-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          display: none;
          flex-direction: column;
          min-width: 120px;
          z-index: 10;
          overflow: hidden;
        }

        .export-dropdown:hover .export-menu {
          display: flex;
        }

        .export-menu button {
          padding: 10px 16px;
          background: transparent;
          border: none;
          color: var(--text-main);
          text-align: left;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }

        .export-menu button:hover {
          background: var(--bg-main);
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default Filters;

import React from 'react';

const FinanceGoal = () => {
  const tabs = ['First home', 'New car', 'Vacation'];
  const activeTab = 'First home';

  return (
    <div className="finance-goal-card">
      <h3 className="card-title">Tracking your finance goal</h3>
      
      <div className="tabs">
        {tabs.map(tab => (
          <button key={tab} className={`tab-btn ${tab === activeTab ? 'active' : ''}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="goal-content">
        <div className="goal-visual">
          <div className="goal-circle">
            <h2 className="goal-amount">$3,190</h2>
            <span className="goal-status">On track</span>
          </div>
          
          <div className="progress-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="#f1f5f9" strokeWidth="8" fill="none" />
              <circle 
                cx="50" cy="50" r="45" 
                stroke="#7c3aed" strokeWidth="8" fill="none" 
                strokeDasharray="282.7" 
                strokeDashoffset="240" 
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="goal-stats">
          <div className="stat-item">
            <span className="stat-label">Future savings</span>
            <span className="stat-value">$700</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Target</span>
            <span className="stat-value">$24,000</span>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .finance-goal-card {
          grid-column: span 1;
          background: white;
          border-radius: var(--radius-lg);
          padding: 24px;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .card-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-main);
        }

        .tabs {
          display: flex;
          gap: 8px;
        }

        .tab-btn {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          border: 1px solid var(--border-color);
        }

        .tab-btn.active {
          background: var(--bg-main);
          color: var(--text-main);
          border-color: var(--border-color);
        }

        .goal-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          flex: 1;
          justify-content: center;
        }

        .goal-visual {
          position: relative;
          width: 160px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .goal-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .goal-amount {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-main);
        }

        .goal-status {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 10px;
          background: #ede9fe;
          color: #7c3aed;
          border-radius: 999px;
          margin-top: 4px;
        }

        .progress-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .goal-stats {
          display: flex;
          justify-content: space-between;
          width: 100%;
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
        }

        .stat-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
};

export default FinanceGoal;

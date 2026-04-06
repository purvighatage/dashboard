import React from 'react';
import useCountUp from '../../hooks/useCountUp';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, numericValue, subValue, trend, trendPercent, type = 'success' }) => {
  const animatedValue = useCountUp(numericValue || 0, 1000);
  const isNegative = numericValue < 0;
  const displayValue = `${isNegative ? '-' : ''}₹${Math.abs(animatedValue).toLocaleString()}`;

  return (
    <div className={`card-base stat-card animate-fade`}>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <h2 className={`stat-value ${type === 'danger' ? 'danger' : ''}`}>
          {displayValue}
        </h2>
        <div className="stat-bottom-row">
          {trendPercent && (
            <div className={`trend-chip ${trend}`}>
              {trend === 'up' ? '+' : '-'}{trendPercent}%
            </div>
          )}
          <span className="stat-change">{subValue}</span>
        </div>
      </div>
      <div className="stat-decoration">
        <div className={`decoration-circle ${type}`}></div>
      </div>

      <style jsx="true">{`
        .stat-card {
          min-height: 160px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .stat-content {
          position: relative;
          z-index: 2;
        }

        .stat-label {
          display: block;
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 34px;
          font-weight: 700;
          color: var(--success);
          margin-bottom: 8px;
        }
        
        .stat-value.danger {
          color: var(--danger);
        }

        .stat-bottom-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .trend-chip {
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .trend-chip.up {
          background: rgba(103, 195, 167, 0.15);
          color: #2D9C75;
        }

        .trend-chip.down {
          background: rgba(255, 126, 126, 0.15);
          color: #FF4D4D;
        }

        .stat-change {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .stat-decoration {
          position: absolute;
          top: -20px;
          right: -20px;
          z-index: 1;
        }

        .decoration-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--success);
          opacity: 0.08;
        }
        
        .decoration-circle.danger {
          background: var(--danger);
        }
      `}</style>
    </div>
  );
};

export default StatCard;

import { useMemo } from 'react';
import useTransactionsStore from '../../store/transactionsStore';
import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

const FinanceInsights = () => {
  const { transactions, getStats } = useTransactionsStore();
  const stats = useMemo(() => getStats(), [transactions, getStats]);
  
  const insights = useMemo(() => {
    if (transactions.length === 0) return { topCategory: 'None', message: 'No data yet.', savingsRate: 0, dailyAvg: 0 };
    
    // Total income/expense
    const incomeTotal = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'Expense');
    const expenseTotal = expenses.reduce((sum, t) => sum + t.amount, 0);

    const expensesByCategory = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {});

    // Savings Rate Percentage
    const savingsRate = incomeTotal > 0 ? ((incomeTotal - expenseTotal) / incomeTotal) * 100 : 0;
    
    // Daily Average (Standard 30-day month or current days passed)
    const now = new Date();
    const currentDay = now.getDate();
    const dailyAvg = expenseTotal / currentDay;

    // Find top category
    const entries = Object.entries(expensesByCategory);
    let topCategory = 'None';
    let topAmount = 0;
    
    if (entries.length > 0) {
      entries.sort((a, b) => b[1] - a[1]);
      topCategory = entries[0][0];
      topAmount = entries[0][1];
    }

    const advice = savingsRate > 20 
      ? "You're a super saver! Consider investing your surplus." 
      : savingsRate > 0 
      ? "Good job! You're living within your means." 
      : "Warning: Your spending exceeds your income. Review your non-essentials.";

    return {
      topCategory,
      topAmount,
      savingsRate: Math.max(0, savingsRate.toFixed(1)),
      dailyAvg: dailyAvg.toFixed(2),
      advice,
      message: incomeTotal > expenseTotal 
        ? `You saved ₹${(incomeTotal - expenseTotal).toLocaleString()} this month.`
        : `You are overspent by ₹${(expenseTotal - incomeTotal).toLocaleString()}!`
    };
  }, [transactions]);

  return (
    <div className="card-base animate-fade" style={{ background: 'var(--card-bg)' }}>
      <div className="card-header-row">
        <h3 className="stat-label">FINANCIAL INSIGHTS</h3>
        <Lightbulb size={20} color="var(--primary)" />
      </div>

      <div className="insights-list" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="insights-row">
          <div className="insight-item-box flex-1">
            <span className="small-label">TOP SPEND</span>
            <span className="insight-highlight">{insights.topCategory}</span>
            <span className="insight-subtext">₹{insights.topAmount?.toLocaleString()}</span>
          </div>
          <div className="insight-item-box flex-1">
            <span className="small-label">SAVINGS RATE</span>
            <span className="insight-highlight">{insights.savingsRate}%</span>
            <span className="insight-subtext">of income</span>
          </div>
        </div>

        <div className="insight-item-box secondary">
          <span className="small-label">DAILY AVERAGE SPENDING</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="insight-highlight">₹{insights.dailyAvg}</span>
            <span className="insight-subtext">/ day</span>
          </div>
        </div>

        <div className="insight-item-box accent">
          <div className="insight-indicator"></div>
          <div className="insight-body">
            <span className="small-label">PROACTIVE ADVICE</span>
            <p className="insight-para" style={{ color: 'var(--primary)', fontWeight: '700' }}>{insights.advice}</p>
            <p className="insight-para" style={{ fontSize: '13px', marginTop: '4px' }}>{insights.message}</p>
          </div>
        </div>

        {transactions.length === 0 && (
          <div className="insight-empty">
            <AlertCircle size={20} />
            <span>Add transactions to see insights</span>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .insights-row {
          display: flex;
          gap: 16px;
        }
        
        .flex-1 { flex: 1; }

        .insight-item-box {
          display: flex;
          flex-direction: column;
          padding: 20px;
          border-radius: 16px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          position: relative;
          overflow: hidden;
          transition: transform 0.2s;
        }

        .insight-item-box:hover {
          transform: translateY(-2px);
        }

        .insight-item-box.secondary {
          background: rgba(155, 126, 189, 0.05);
        }

        .insight-item-box.accent {
          background: var(--card-bg);
          border-left: 4px solid var(--primary);
        }

        .insight-subtext {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 2px;
        }

        .small-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 6px;
          letter-spacing: 0.5px;
        }

        .insight-highlight {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-main);
        }

        .insight-para {
          font-size: 14px;
          line-height: 1.4;
          color: var(--text-main);
          margin: 0;
        }

        .insight-empty {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          color: var(--text-muted);
          font-size: 14px;
          background: var(--bg-main);
          border-radius: 12px;
          border: 1px dashed var(--border-color);
        }
      `}</style>
    </div>
  );
};

export default FinanceInsights;

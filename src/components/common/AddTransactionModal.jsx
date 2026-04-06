import React, { useState, useEffect, useRef } from 'react';
import useTransactionsStore from '../../store/transactionsStore';
import useToastStore from '../../store/toastStore';
import useRoleStore from '../../store/roleStore';
import { X } from 'lucide-react';

const AddTransactionModal = ({ onClose }) => {
  const { addTransaction } = useTransactionsStore();
  const { addToast } = useToastStore();
  const { role } = useRoleStore();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food & Dining',
    type: 'Expense',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const nameInputRef = useRef(null);

  const isFutureDate = (d) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(d);
    return selected > today;
  };

  useEffect(() => {
    // Auto-focus name input
    if (nameInputRef.current) nameInputRef.current.focus();

    // Security guard: close if role changes to Viewer
    if (role === 'Viewer') onClose();

    // Escape key listener
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    const newErrors = {};
    const parsedAmount = parseFloat(formData.amount);
    
    // Strict validations
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (isNaN(parsedAmount) || parsedAmount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (isFutureDate(formData.date)) newErrors.date = 'Future dates are not allowed';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    
    // Simulate API delay for Wow Factor
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addTransaction({
      ...formData,
      id: Date.now(),
      amount: parseFloat(parsedAmount.toFixed(2)),
    });
    
    addToast('Transaction added successfully!', 'success');
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card-base animate-fade" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="serif">Add Transaction</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>NAME</label>
            <input 
              ref={nameInputRef}
              type="text" 
              className={`fintrack-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                if (errors.name) setErrors({...errors, name: null});
              }}
              placeholder="e.g. Starbucks Coffee"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>CATEGORY</label>
              <select 
                className="fintrack-input"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Food & Dining">Food & Dining</option>
                <option value="Housing">Housing</option>
                <option value="Transport">Transport</option>
                <option value="Salary">Salary</option>
                <option value="Shopping">Shopping</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label>TYPE</label>
              <select 
                className="fintrack-input"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>AMOUNT (₹)</label>
              <input 
                type="number" 
                min="0.01"
                className={`fintrack-input ${errors.amount ? 'error' : ''}`}
                step="0.01"
                value={formData.amount}
                onChange={(e) => {
                  setFormData({...formData, amount: e.target.value});
                  if (errors.amount) setErrors({...errors, amount: null});
                }}
                placeholder="0.00"
              />
              {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>
            <div className="form-group flex-1">
              <label>DATE</label>
              <input 
                type="date" 
                required
                max={new Date().toISOString().split('T')[0]}
                className={`fintrack-input ${errors.date ? 'error' : ''}`}
                value={formData.date}
                onChange={(e) => {
                  setFormData({...formData, date: e.target.value});
                  if (errors.date) setErrors({...errors, date: null});
                }}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className={`submit-btn primary-btn ${isSaving ? 'shimmer-loading' : ''}`}
            disabled={isSaving}
          >
            {isSaving ? 'Processing...' : 'Add Transaction'}
          </button>
        </form>
      </div>

      <style jsx="true">{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
          padding: 32px;
          background: var(--card-bg);
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: flex;
          gap: 16px;
        }

        .flex-1 { flex: 1; }

        .form-group label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 8px;
          letter-spacing: 1px;
        }

        .fintrack-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: #f8fafc;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .fintrack-input.error {
          border-color: var(--danger);
          background: #fff5f5;
        }

        .error-message {
          color: var(--danger);
          font-size: 11px;
          margin-top: 4px;
          display: block;
          font-weight: 500;
        }

        .fintrack-input:focus {
          border-color: var(--primary);
        }

        .submit-btn {
          margin-top: 12px;
          padding: 16px;
          background: var(--primary);
          color: white;
          border-radius: 16px;
          font-weight: 600;
          font-size: 16px;
          transition: transform 0.2s, background 0.2s;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
      `}</style>
    </div>
  );
};

export default AddTransactionModal;

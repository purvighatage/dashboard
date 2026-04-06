import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import useTransactionsStore from '../../store/transactionsStore';
import useToastStore from '../../store/toastStore';
import useRoleStore from '../../store/roleStore';

const EditModal = ({ transaction, onClose }) => {
  const { deleteTransaction, updateTransaction } = useTransactionsStore();
  const { addToast } = useToastStore();
  const { role } = useRoleStore();

  const [formData, setFormData] = useState({ ...transaction });

  useEffect(() => {
    // Escape key listener
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    
    // Close modal if role switches to Viewer while open
    if (role === 'Viewer') onClose();
    
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, role]);

  if (!transaction) return null;

  const handleUpdate = () => {
    updateTransaction(formData);
    addToast('Transaction updated', 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card-base animate-fade" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="serif">{role === 'Admin' ? 'Edit Transaction' : 'Transaction Details'}</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="modal-body">
          <div className="form-group-edit">
            <label>NAME</label>
            <input 
              className="fintrack-input"
              value={formData.name}
              readOnly={role !== 'Admin'}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="form-row-edit">
            <div className="form-group-edit flex-1">
              <label>CATEGORY</label>
              <select 
                className="fintrack-input"
                value={formData.category}
                disabled={role !== 'Admin'}
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
            <div className="form-group-edit flex-1">
              <label>TYPE</label>
              <select 
                className="fintrack-input"
                value={formData.type}
                disabled={role !== 'Admin'}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="form-row-edit">
            <div className="form-group-edit flex-1">
              <label>AMOUNT (₹)</label>
              <input 
                type="number"
                className="fintrack-input"
                value={formData.amount}
                readOnly={role !== 'Admin'}
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
              />
            </div>
            <div className="form-group-edit flex-1">
              <label>DATE</label>
              <input 
                type="date"
                className="fintrack-input"
                value={formData.date}
                readOnly={role !== 'Admin'}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>
        </div>

        {role === 'Admin' && (
          <div className="modal-footer-edit">
            <button className="primary-btn" onClick={handleUpdate} style={{ flex: 1 }}>Update changes</button>
            <button 
              className="danger-btn"
              onClick={() => {
                deleteTransaction(transaction.id);
                onClose();
                addToast('Transaction deleted', 'undo', {
                  label: 'Undo',
                  onClick: () => {
                    updateTransaction(transaction); // Re-add it
                    addToast('Transaction restored!', 'success');
                  }
                });
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          width: 100%; max-width: 500px;
          padding: 32px; background: var(--card-bg);
          max-height: 90vh; overflow-y: auto;
        }

        .modal-body { display: flex; flex-direction: column; gap: 16px; }
        .form-row-edit { display: flex; gap: 16px; }
        .flex-1 { flex: 1; }

        .form-group-edit label {
          display: block; font-size: 11px; font-weight: 700;
          color: var(--text-muted); margin-bottom: 6px; letter-spacing: 0.5px;
        }

        .fintrack-input {
          width: 100%; padding: 12px; border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--bg-main); font-size: 14px;
        }

        .modal-footer-edit {
          margin-top: 32px; display: flex; gap: 12px;
        }
      `}</style>
    </div>
  );
};

export default EditModal;

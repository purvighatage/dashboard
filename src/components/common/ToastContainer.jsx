import React from 'react';
import useToastStore from '../../store/toastStore';
import { CheckCircle2, AlertCircle, X, RotateCcw } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`fintrack-toast ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' ? (
              <CheckCircle2 size={20} color="#2D9C75" />
            ) : toast.type === 'undo' ? (
              <RotateCcw size={20} color="var(--primary)" />
            ) : (
              <AlertCircle size={20} color="#FF4D4D" />
            )}
          </div>
          
          <div className="toast-content">
            <p>{toast.message}</p>
          </div>

          {toast.action && (
            <button 
              className="toast-action-btn"
              onClick={() => {
                toast.action.onClick();
                removeToast(toast.id);
              }}
            >
              {toast.action.label}
            </button>
          )}

          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            <X size={16} />
          </button>
        </div>
      ))}

      <style jsx="true">{`
        .toast-container {
          position: fixed;
          bottom: 32px;
          right: 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 9999;
          pointer-events: none; /* Container itself shouldn't block clicks */
        }

        .fintrack-toast {
          background: white; /* Force solid white or use card-bg but hardcode to avoid transparency clashes */
          background: var(--card-bg, #fff);
          color: var(--text-main);
          padding: 16px;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 300px;
          pointer-events: auto; /* Re-enable clicks for the toast itself */
          animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          border: 1px solid var(--border-color);
        }

        .toast-content p {
          font-size: 14px;
          font-weight: 500;
          margin: 0;
        }

        .toast-action-btn {
          background: var(--primary-light);
          color: var(--primary);
          border: none;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          margin-left: auto;
          transition: transform 0.2s;
        }

        .toast-action-btn:hover {
          transform: scale(0.95);
        }

        .toast-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          margin-left: 4px;
        }

        .toast-close:hover {
          background: rgba(0,0,0,0.05);
          color: var(--text-main);
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;

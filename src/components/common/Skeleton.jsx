import React from 'react';

const Skeleton = ({ width, height, borderRadius = '12px', className = '' }) => {
  return (
    <div 
      className={`fintrack-skeleton ${className}`}
      style={{ width, height, borderRadius }}
    >
      <style jsx="true">{`
        .fintrack-skeleton {
          background: linear-gradient(90deg, 
            var(--bg-main) 25%, 
            var(--sidebar-bg) 50%, 
            var(--bg-main) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default Skeleton;

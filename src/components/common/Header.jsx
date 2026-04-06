import React from 'react';
import useRoleStore from '../../store/roleStore';
import useThemeStore from '../../store/themeStore';
import { Moon, Sun } from 'lucide-react';

const Header = () => {
  const { role } = useRoleStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <header className="header animate-fade">
      <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="greeting-text">
            Hello, <span className="serif" style={{ color: 'var(--primary)', fontWeight: 400 }}>Purva!</span>
          </h1>
          <p className="subtitle-text">
            Your financial overview — April 2026
          </p>
        </div>
        <button 
          onClick={toggleTheme}
          className="secondary-btn"
          style={{ width: '48px', height: '48px', borderRadius: '50%', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;

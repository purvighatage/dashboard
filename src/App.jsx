import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/Transactions';
import InsightsPage from './pages/Insights';
import Messages from './pages/Messages';
import { Menu, X } from 'lucide-react';
import useThemeStore from './store/themeStore';
import useUIStore from './store/uiStore';
import useRoleStore from './store/roleStore';
import ToastContainer from './components/common/ToastContainer';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode } = useThemeStore();
  const { openAddModal, closeAddModal, isAddModalOpen } = useUIStore();
  const { role } = useRoleStore();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') {
          document.activeElement.blur();
        }
        return;
      }

      if (e.key.toLowerCase() === 'n' && role === 'Admin') {
        e.preventDefault();
        openAddModal();
      }

      if (e.key === 'Escape') {
        closeAddModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [role, openAddModal, closeAddModal]);

  // Ensure body gets class on initial load
  useEffect(() => {
    if (isDarkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [isDarkMode]);

  return (
    <>
      <button 
        className="mobile-toggle" 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="dashboard-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </main>
      
      <ToastContainer />
    </>
  );
}

export default App;

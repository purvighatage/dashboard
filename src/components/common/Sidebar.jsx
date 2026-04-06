import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Layout, 
  List, 
  Target, 
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import useRoleStore from '../../store/roleStore';

const Sidebar = ({ isOpen, onClose }) => {
  const { role, setRole } = useRoleStore();

  const menuItems = [
    { icon: Layout, label: 'Dashboard', path: '/' },
    { icon: List, label: 'Transactions', path: '/transactions' },
    { icon: Target, label: 'Insights', path: '/insights' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-circle">L</div>
          <span className="logo-text">Lumina</span>
        </div>

        <div className="profile-card">
          <div className="profile-avatar" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>P</div>
          <div className="profile-info">
            <span className="profile-name">Purva T.</span>
            <span className="profile-role">{role.toLowerCase()}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon size={20} />
                  <span className="item-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-bottom">
          <div className="role-selector-container">
            <span className="role-label">Role</span>
            <select 
              className="role-select" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
            <span className="role-badge">{role}</span>
          </div>
        </div>

      <style jsx="true">{`
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(4px);
          z-index: 90;
        }
        
        .sidebar-nav {
          margin-top: 10px;
        }

        .item-label {
          font-size: 15px;
        }
      `}</style>
    </aside>
    </>
  );
};

export default Sidebar;

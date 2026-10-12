import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Calendar, 
  CreditCard, 
  Activity,
  LogOut,
  User as UserIcon
} from 'lucide-react';

export default function Sidebar({ currentUser, onLogout }) {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patients', label: 'Patients', icon: Users },
    { to: '/doctors', label: 'Doctors', icon: UserCheck },
    { to: '/appointments', label: 'Appointments', icon: Calendar },
    { to: '/billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Activity size={22} />
        </div>
        <div className="sidebar-title">
          <h1>MediCare HMS</h1>
          <span>Clinical Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end={item.to === '/'}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout Button */}
      {currentUser && (
        <div style={{
          padding: '12px 16px',
          margin: '0 12px 8px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              flexShrink: 0
            }}>
              {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.fullName || currentUser.username}
              </div>
              <div style={{ fontSize: '10px', color: '#38bdf8' }}>{currentUser.role || 'ADMIN'}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sign Out"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '6px'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      )}

      <div className="sidebar-footer">
        <div className="db-status-pill">
          <span className="db-status-dot"></span>
          <span>MongoDB Atlas</span>
        </div>
        <div>Spring Boot 3.3.4 REST API</div>
      </div>
    </aside>
  );
}

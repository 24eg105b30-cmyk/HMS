import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import BillingPage from './pages/BillingPage';
import AuthPage from './pages/AuthPage';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('hms_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('hms_user');
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
  };

  return (
    <BrowserRouter>
      {/* If not logged in, show AuthPage (Sign in / Sign up) */}
      {!currentUser ? (
        <>
          <AuthPage onLoginSuccess={(user) => setCurrentUser(user)} showToast={showToast} />
          {/* Toast Notification Container */}
          <div className="toast-container">
            {toasts.map((toast) => (
              <div key={toast.id} className={`toast toast-${toast.type}`}>
                {toast.type === 'success' && <CheckCircle2 size={18} />}
                {toast.type === 'error' && <AlertCircle size={18} />}
                {toast.type === 'info' && <Info size={18} />}
                <span style={{ flex: 1 }}>{toast.message}</span>
                <button
                  onClick={() => removeToast(toast.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="app-layout">
          {/* Sidebar Navigation */}
          <Sidebar currentUser={currentUser} onLogout={handleLogout} />

          {/* Main Container */}
          <div className="main-wrapper">
            <Navbar />

            <main className="content-area">
              <Routes>
                <Route path="/" element={<DashboardPage showToast={showToast} />} />
                <Route path="/patients" element={<PatientsPage showToast={showToast} />} />
                <Route path="/doctors" element={<DoctorsPage showToast={showToast} />} />
                <Route path="/appointments" element={<AppointmentsPage showToast={showToast} />} />
                <Route path="/billing" element={<BillingPage showToast={showToast} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>

          {/* Toast Notification Container */}
          <div className="toast-container">
            {toasts.map((toast) => (
              <div key={toast.id} className={`toast toast-${toast.type}`}>
                {toast.type === 'success' && <CheckCircle2 size={18} />}
                {toast.type === 'error' && <AlertCircle size={18} />}
                {toast.type === 'info' && <Info size={18} />}
                <span style={{ flex: 1 }}>{toast.message}</span>
                <button
                  onClick={() => removeToast(toast.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Shield } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  const titles = {
    '/': { title: 'Dashboard Overview', subtitle: 'Live hospital statistics and operational overview' },
    '/patients': { title: 'Patients Directory', subtitle: 'Manage patient profiles, admissions, and symptoms' },
    '/doctors': { title: 'Medical Staff & Doctors', subtitle: 'Doctor profiles, specializations, and office hours' },
    '/appointments': { title: 'Appointments Calendar', subtitle: 'Book consultations and monitor schedule statuses' },
    '/billing': { title: 'Billing & Invoicing', subtitle: 'Hospital invoices, payment tracking, and revenue overview' },
  };

  const currentInfo = titles[path] || { title: 'Hospital Management', subtitle: 'Clinical Portal' };
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="topbar">
      <div className="page-headline">
        <h2>{currentInfo.title}</h2>
        <p>{currentInfo.subtitle}</p>
      </div>

      <div className="topbar-actions">
        <div className="live-badge">
          <Calendar size={14} color="#0284c7" />
          <span>{today}</span>
        </div>

        <div className="live-badge" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }}>
          <Shield size={14} color="#059669" />
          <span>Atlas Sync Active</span>
        </div>
      </div>
    </header>
  );
}

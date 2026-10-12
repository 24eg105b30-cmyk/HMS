import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  PlusCircle, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  Server,
  RefreshCw
} from 'lucide-react';
import { getDashboardStats, getAppointments, getPatients, checkHealth } from '../api/api';
import StatusBadge from '../components/StatusBadge';

export default function DashboardPage({ showToast }) {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalBills: 0,
    totalRevenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [backendAlive, setBackendAlive] = useState(false);
  const [dbNotice, setDbNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const healthRes = await checkHealth().catch(() => null);
      if (healthRes && healthRes.success) {
        setBackendAlive(true);
      }

      const [statsRes, aptsRes] = await Promise.allSettled([
        getDashboardStats(),
        getAppointments(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
        setDbNotice(null);
      } else if (statsRes.status === 'rejected') {
        setDbNotice(statsRes.reason?.message || 'Database connection pending');
      }

      if (aptsRes.status === 'fulfilled' && aptsRes.value?.data) {
        setRecentAppointments(aptsRes.value.data.slice(-5).reverse());
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      {/* Notice Banner if Atlas is pending */}
      {dbNotice && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          color: '#92400e'
        }}>
          <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: '2px', color: '#d97706' }} />
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
              Backend is active on localhost:8080 — MongoDB Atlas Connection Pending
            </h4>
            <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#78350f' }}>
              Spring Boot is communicating with React, but needs your MongoDB Atlas connection string. To connect your cloud database, set the environment variable:
            </p>
            <code style={{
              display: 'inline-block',
              background: '#fef3c7',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              marginTop: '8px',
              fontFamily: 'monospace'
            }}>
              $env:MONGODB_URI = "mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/hospital_management?retryWrites=true&w=majority"
            </code>
          </div>
        </div>
      )}

      {/* Top Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span>Total Patients</span>
            <h3>{stats.totalPatients}</h3>
            <p>Database Records</p>
          </div>
          <div className="stat-icon icon-blue">
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span>Specialist Doctors</span>
            <h3>{stats.totalDoctors}</h3>
            <p>Active Staff</p>
          </div>
          <div className="stat-icon icon-teal">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span>Appointments</span>
            <h3>{stats.totalAppointments}</h3>
            <p>Scheduled Consultations</p>
          </div>
          <div className="stat-icon icon-purple">
            <Calendar size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span>Pending Invoices</span>
            <h3>{stats.totalBills}</h3>
            <p>Billing Records</p>
          </div>
          <div className="stat-icon icon-emerald">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Quick Operations with React Router Links */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <h3>Quick Operations</h3>
            <p>Hospital administration workflows</p>
          </div>
          <div className="controls-bar">
            <button className="btn btn-secondary btn-sm" onClick={loadData} title="Refresh Dashboard">
              <RefreshCw size={14} /> Refresh Stats
            </button>
            <Link to="/patients" className="btn btn-primary btn-sm">
              <PlusCircle size={15} /> Patients Page
            </Link>
            <Link to="/doctors" className="btn btn-secondary btn-sm">
              <UserCheck size={15} /> Doctors Page
            </Link>
            <Link to="/appointments" className="btn btn-secondary btn-sm">
              <Calendar size={15} /> Appointments Page
            </Link>
            <Link to="/billing" className="btn btn-secondary btn-sm">
              <DollarSign size={15} /> Billing Page
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Appointments */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <h3>Recent Appointments</h3>
              <p>Latest scheduled and completed consultations</p>
            </div>
            <Link to="/appointments" className="btn btn-secondary btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Apt ID</th>
                  <th>Patient ID</th>
                  <th>Doctor ID</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                      {loading ? 'Checking records...' : 'No appointments recorded yet.'}
                    </td>
                  </tr>
                ) : (
                  recentAppointments.map((apt) => (
                    <tr key={apt.id || apt.appointmentId}>
                      <td style={{ fontWeight: 600 }}>{apt.appointmentId}</td>
                      <td>{apt.patientId}</td>
                      <td>{apt.doctorId}</td>
                      <td>{apt.appointmentDate} at {apt.appointmentTime}</td>
                      <td><StatusBadge status={apt.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Overview Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <h3>System Overview</h3>
              <p>Services on Localhost</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <Server size={18} color="#059669" />
                <span style={{ fontWeight: 600, fontSize: '14px' }}>Spring Boot REST API</span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                Port: <strong>8080</strong> ({backendAlive ? '🟢 Online & Responding' : 'Checking...'})
              </p>
            </div>

            <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <Activity size={18} color="#0284c7" />
                <span style={{ fontWeight: 600, fontSize: '14px' }}>React + Vite Frontend</span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                Port: <strong>5173</strong> (🟢 Active)
              </p>
            </div>

            <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <ShieldCheck size={18} color={dbNotice ? '#d97706' : '#059669'} />
                <span style={{ fontWeight: 600, fontSize: '14px' }}>Database: hospital_management</span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                {dbNotice ? '🟡 Awaiting MONGODB_URI in environment' : '🟢 MongoDB Atlas Connected'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

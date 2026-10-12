import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  Clock, 
  Filter, 
  XCircle 
} from 'lucide-react';
import { 
  getAppointments, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment,
  getPatients,
  getDoctors
} from '../api/api';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

export default function AppointmentsPage({ showToast }) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const initialForm = {
    appointmentId: '',
    patientId: '',
    doctorId: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '10:00 AM',
    status: 'Scheduled',
  };
  const [formData, setFormData] = useState(initialForm);

  const loadAppointments = async (overrideDate = filterDate, overrideStatus = filterStatus) => {
    try {
      setLoading(true);
      const params = {};
      if (overrideDate) params.date = overrideDate;
      if (overrideStatus) params.status = overrideStatus;
      const res = await getAppointments(params);
      setAppointments(res.data || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownData = async () => {
    try {
      const [ptsRes, docsRes] = await Promise.allSettled([getPatients(), getDoctors()]);
      if (ptsRes.status === 'fulfilled') setPatients(ptsRes.value.data || []);
      if (docsRes.status === 'fulfilled') setDoctors(docsRes.value.data || []);
    } catch {
      // Non-blocking
    }
  };

  useEffect(() => {
    loadAppointments();
    loadDropdownData();
  }, []);

  const handleFilterChange = (newDate, newStatus) => {
    setFilterDate(newDate);
    setFilterStatus(newStatus);
    loadAppointments(newDate, newStatus);
  };

  const handleClearFilters = () => {
    setFilterDate('');
    setFilterStatus('');
    loadAppointments('', '');
  };

  const openAddModal = () => {
    setEditingAppointment(null);
    setFormData({
      appointmentId: `APT-${Math.floor(100 + Math.random() * 900)}`,
      patientId: patients.length > 0 ? patients[0].patientId : '',
      doctorId: doctors.length > 0 ? doctors[0].doctorId : '',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '10:00 AM',
      status: 'Scheduled',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (apt) => {
    setEditingAppointment(apt);
    setFormData({
      appointmentId: apt.appointmentId,
      patientId: apt.patientId,
      doctorId: apt.doctorId,
      appointmentDate: apt.appointmentDate,
      appointmentTime: apt.appointmentTime,
      status: apt.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        await updateAppointment(editingAppointment.appointmentId || editingAppointment.id, formData);
        showToast('Appointment updated successfully!', 'success');
      } else {
        await createAppointment(formData);
        showToast('Appointment booked successfully in MongoDB!', 'success');
      }
      setIsModalOpen(false);
      loadAppointments();
    } catch (err) {
      showToast(err.message || 'Failed to save appointment', 'error');
    }
  };

  const handleDelete = async (apt) => {
    const confirmDelete = window.confirm(`Are you sure you want to cancel and delete appointment ${apt.appointmentId}?`);
    if (!confirmDelete) return;

    try {
      await deleteAppointment(apt.appointmentId || apt.id);
      showToast('Appointment deleted successfully', 'success');
      loadAppointments();
    } catch (err) {
      showToast(err.message || 'Failed to delete appointment', 'error');
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <h3>Appointment Management</h3>
            <p>Schedule patient consultations, monitor status, and filter by date or state</p>
          </div>

          <div className="controls-bar">
            {/* Filter by Date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="date"
                className="select-filter"
                value={filterDate}
                onChange={(e) => handleFilterChange(e.target.value, filterStatus)}
                title="Filter by appointment date"
              />
            </div>

            {/* Filter by Status */}
            <select
              className="select-filter"
              value={filterStatus}
              onChange={(e) => handleFilterChange(filterDate, e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {(filterDate || filterStatus) && (
              <button className="btn btn-secondary btn-sm" onClick={handleClearFilters}>
                <XCircle size={14} /> Clear Filter
              </button>
            )}

            <button className="btn btn-secondary" onClick={() => loadAppointments()} title="Refresh">
              <RefreshCw size={15} /> Refresh
            </button>

            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={16} /> Book Appointment
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Patient ID</th>
                <th>Doctor ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    Filtering and loading appointments from MongoDB Atlas...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <CalendarIcon size={40} />
                      <h4>No Appointments Found</h4>
                      <p>
                        {filterDate || filterStatus
                          ? 'No appointments matched your filter criteria.'
                          : 'Schedule your first patient appointment.'}
                      </p>
                      <button className="btn btn-primary btn-sm" onClick={openAddModal}>
                        Book Appointment
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id || apt.appointmentId}>
                    <td><strong style={{ color: '#0284c7' }}>{apt.appointmentId}</strong></td>
                    <td style={{ fontWeight: 600 }}>{apt.patientId}</td>
                    <td>{apt.doctorId}</td>
                    <td>{apt.appointmentDate}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} color="#64748b" />
                        <span>{apt.appointmentTime}</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={apt.status} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button 
                          className="btn-icon" 
                          onClick={() => openEditModal(apt)} 
                          title="Edit Appointment"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(apt)} 
                          title="Cancel/Delete Appointment"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAppointment ? `Edit Appointment (${editingAppointment.appointmentId})` : 'Book New Appointment'}
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Appointment ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.appointmentId}
                  onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                  disabled={!!editingAppointment}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Patient ID</label>
                {patients.length > 0 ? (
                  <select
                    className="form-control"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    required
                  >
                    <option value="">Select a Patient</option>
                    {patients.map((p) => (
                      <option key={p.patientId} value={p.patientId}>
                        {p.patientId} - {p.fullName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g. PAT-101"
                    className="form-control"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    required
                  />
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Doctor ID</label>
                {doctors.length > 0 ? (
                  <select
                    className="form-control"
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    required
                  >
                    <option value="">Select a Doctor</option>
                    {doctors.map((d) => (
                      <option key={d.doctorId} value={d.doctorId}>
                        {d.doctorId} - Dr. {d.fullName} ({d.specialization})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g. DOC-101"
                    className="form-control"
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    required
                  />
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Appointment Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Appointment Time</label>
                <input
                  type="text"
                  placeholder="e.g. 10:30 AM"
                  className="form-control"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAppointment ? 'Save Changes' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

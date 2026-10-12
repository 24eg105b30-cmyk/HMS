import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  Mail, 
  Phone, 
  Clock, 
  Search,
  Eye
} from 'lucide-react';
import { 
  getDoctors, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor 
} from '../api/api';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

export default function DoctorsPage({ showToast }) {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const initialForm = {
    doctorId: '',
    fullName: '',
    specialization: 'Cardiology',
    phone: '',
    email: '',
    availability: 'Mon - Fri (09:00 AM - 05:00 PM)',
  };
  const [formData, setFormData] = useState(initialForm);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const res = await getDoctors();
      const list = res.data || [];
      setDoctors(list);
      setFilteredDoctors(list);
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to fetch doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (!term) {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(
        doctors.filter(
          (d) =>
            d.fullName.toLowerCase().includes(term) ||
            d.specialization.toLowerCase().includes(term) ||
            d.doctorId.toLowerCase().includes(term)
        )
      );
    }
  };

  const openAddModal = () => {
    setEditingDoctor(null);
    setFormData({
      doctorId: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      fullName: '',
      specialization: 'Cardiology',
      phone: '',
      email: '',
      availability: 'Mon - Fri (09:00 AM - 05:00 PM)',
    });
    setIsModalOpen(true);
  };

  const openViewModal = (doctor) => {
    setViewingDoctor(doctor);
    setIsViewModalOpen(true);
  };

  const openEditModal = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      doctorId: doctor.doctorId,
      fullName: doctor.fullName,
      specialization: doctor.specialization,
      phone: doctor.phone,
      email: doctor.email,
      availability: doctor.availability,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await updateDoctor(editingDoctor.doctorId || editingDoctor.id, formData);
        if (showToast) showToast('Doctor profile updated successfully!', 'success');
      } else {
        await createDoctor(formData);
        if (showToast) showToast('Doctor registered successfully in MongoDB!', 'success');
      }
      setIsModalOpen(false);
      loadDoctors();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to save doctor', 'error');
    }
  };

  const handleDelete = async (doctor) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete Dr. ${doctor.fullName} (${doctor.doctorId})?`);
    if (!confirmDelete) return;

    try {
      await deleteDoctor(doctor.doctorId || doctor.id);
      if (showToast) showToast('Doctor deleted successfully', 'success');
      loadDoctors();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to delete doctor', 'error');
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <h3>Doctor Management</h3>
            <p>Manage medical specialists, schedules, contact details, and availability</p>
          </div>

          <div className="controls-bar">
            <div className="search-input-wrapper">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by doctor name or specialty..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <button className="btn btn-secondary" onClick={loadDoctors} title="Refresh">
              <RefreshCw size={15} /> Refresh
            </button>

            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={16} /> Add Doctor
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Doctor ID</th>
                <th>Doctor Name</th>
                <th>Specialization</th>
                <th>Contact</th>
                <th>Availability</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    Loading doctors from MongoDB Atlas...
                  </td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <UserCheck size={40} />
                      <h4>No Doctors Found</h4>
                      <p>Add certified doctors to schedule consultations.</p>
                      <button className="btn btn-primary btn-sm" onClick={openAddModal}>
                        Add New Doctor
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr key={doc.id || doc.doctorId}>
                    <td><strong style={{ color: '#0284c7' }}>{doc.doctorId}</strong></td>
                    <td style={{ fontWeight: 600 }}>Dr. {doc.fullName}</td>
                    <td>
                      <StatusBadge status={doc.specialization} type="specialty" />
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={12} color="#64748b" />
                          <span>{doc.phone}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={12} color="#64748b" />
                          <span>{doc.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', fontSize: '13px' }}>
                        <Clock size={13} color="#0284c7" />
                        <span>{doc.availability}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button 
                          className="btn-icon" 
                          onClick={() => openViewModal(doc)} 
                          title="View Doctor Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          className="btn-icon" 
                          onClick={() => openEditModal(doc)} 
                          title="Edit Doctor"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(doc)} 
                          title="Delete Doctor"
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

      {/* View Doctor Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={viewingDoctor ? `Dr. ${viewingDoctor.fullName}` : 'Doctor Profile'}
      >
        {viewingDoctor && (
          <div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ color: '#64748b', fontSize: '13px' }}>Doctor ID:</span>
                <strong style={{ color: '#0284c7' }}>{viewingDoctor.doctorId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ color: '#64748b', fontSize: '13px' }}>Full Name:</span>
                <strong>Dr. {viewingDoctor.fullName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ color: '#64748b', fontSize: '13px' }}>Specialization:</span>
                <StatusBadge status={viewingDoctor.specialization} type="specialty" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ color: '#64748b', fontSize: '13px' }}>Phone:</span>
                <span>{viewingDoctor.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ color: '#64748b', fontSize: '13px' }}>Email:</span>
                <span>{viewingDoctor.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                <span style={{ color: '#64748b', fontSize: '13px' }}>Availability:</span>
                <span>{viewingDoctor.availability}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Doctor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoctor ? `Edit Dr. ${editingDoctor.fullName}` : 'Add New Doctor'}
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Doctor ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  disabled={!!editingDoctor}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Mitchell"
                  className="form-control"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specialization</label>
                <select
                  className="form-control"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  required
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Oncology">Oncology</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +1 555-0456"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. dr.mitchell@hospital.com"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Availability Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Mon - Fri (09:00 AM - 04:00 PM)"
                  className="form-control"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingDoctor ? 'Save Changes' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

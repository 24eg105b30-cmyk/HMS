import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  Phone, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';
import { 
  getPatients, 
  searchPatients, 
  createPatient, 
  updatePatient, 
  deletePatient 
} from '../api/api';
import Modal from '../components/Modal';

export default function PatientsPage({ showToast }) {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const initialForm = {
    patientId: '',
    fullName: '',
    age: '',
    gender: 'Male',
    phone: '',
    address: '',
    symptoms: '',
  };
  const [formData, setFormData] = useState(initialForm);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const res = await getPatients();
      setPatients(res.data || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch patients', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    try {
      setLoading(true);
      if (val.trim() === '') {
        const res = await getPatients();
        setPatients(res.data || []);
      } else {
        const res = await searchPatients(val);
        setPatients(res.data || []);
      }
    } catch (err) {
      showToast(err.message || 'Error searching patients', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingPatient(null);
    setFormData({
      patientId: `PAT-${Math.floor(100 + Math.random() * 900)}`,
      fullName: '',
      age: '',
      gender: 'Male',
      phone: '',
      address: '',
      symptoms: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (patient) => {
    setEditingPatient(patient);
    setFormData({
      patientId: patient.patientId,
      fullName: patient.fullName,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address,
      symptoms: patient.symptoms,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.patientId || editingPatient.id, formData);
        showToast('Patient record updated successfully!', 'success');
      } else {
        await createPatient(formData);
        showToast('Patient registered successfully in MongoDB!', 'success');
      }
      setIsModalOpen(false);
      loadPatients();
    } catch (err) {
      showToast(err.message || 'Failed to save patient', 'error');
    }
  };

  const handleDelete = async (patient) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete patient "${patient.fullName}" (${patient.patientId})?`);
    if (!confirmDelete) return;

    try {
      await deletePatient(patient.patientId || patient.id);
      showToast('Patient deleted successfully', 'success');
      loadPatients();
    } catch (err) {
      showToast(err.message || 'Failed to delete patient', 'error');
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <h3>Patient Management</h3>
            <p>Register, search, update, and manage hospital patient records</p>
          </div>

          <div className="controls-bar">
            <div className="search-input-wrapper">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search patient by name..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <button className="btn btn-secondary" onClick={loadPatients} title="Refresh">
              <RefreshCw size={15} /> Refresh
            </button>

            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={16} /> Register Patient
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Full Name</th>
                <th>Age / Gender</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Symptoms</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    Loading patient records from MongoDB Atlas...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <Users size={40} />
                      <h4>No Patients Found</h4>
                      <p>{searchTerm ? 'No patient matched your search criteria.' : 'Get started by registering a new patient record.'}</p>
                      <button className="btn btn-primary btn-sm" onClick={openAddModal}>
                        Register New Patient
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id || patient.patientId}>
                    <td><strong style={{ color: '#0284c7' }}>{patient.patientId}</strong></td>
                    <td style={{ fontWeight: 600 }}>{patient.fullName}</td>
                    <td>{patient.age} yrs • {patient.gender}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={13} color="#64748b" />
                        <span>{patient.phone}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={13} color="#64748b" />
                        <span>{patient.address}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        background: '#f1f5f9', 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        fontSize: '12px',
                        color: '#334155' 
                      }}>
                        {patient.symptoms}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button 
                          className="btn-icon" 
                          onClick={() => openEditModal(patient)} 
                          title="Edit Patient"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(patient)} 
                          title="Delete Patient"
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

      {/* Add / Edit Patient Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPatient ? `Edit Patient (${editingPatient.patientId})` : 'Register New Patient'}
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Patient ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  disabled={!!editingPatient}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="form-control"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  placeholder="e.g. 35"
                  className="form-control"
                  min="0"
                  max="150"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-control"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +1 555-0199"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <input
                  type="text"
                  placeholder="e.g. 123 Elm St, New York"
                  className="form-control"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Symptoms / Reason for Visit</label>
                <textarea
                  className="form-control"
                  placeholder="Describe patient symptoms (e.g. Fever, persistent cough for 3 days)..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingPatient ? 'Save Changes' : 'Register Patient'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

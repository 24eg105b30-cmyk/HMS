import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { 
  getBills, 
  createBill, 
  updateBill, 
  deleteBill,
  getPatients,
  getAppointments
} from '../api/api';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

export default function BillingPage({ showToast }) {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  const initialForm = {
    billId: '',
    patientId: '',
    appointmentId: '',
    amount: '',
    paymentStatus: 'Pending',
    billDate: new Date().toISOString().split('T')[0],
  };
  const [formData, setFormData] = useState(initialForm);

  const loadBills = async () => {
    try {
      setLoading(true);
      const res = await getBills();
      setBills(res.data || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch billing records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownData = async () => {
    try {
      const [ptsRes, aptsRes] = await Promise.allSettled([getPatients(), getAppointments()]);
      if (ptsRes.status === 'fulfilled') setPatients(ptsRes.value.data || []);
      if (aptsRes.status === 'fulfilled') setAppointments(aptsRes.value.data || []);
    } catch {
      // Non-blocking
    }
  };

  useEffect(() => {
    loadBills();
    loadDropdownData();
  }, []);

  const totalRevenue = bills
    .filter((b) => b.paymentStatus?.toLowerCase() === 'paid')
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const pendingAmount = bills
    .filter((b) => b.paymentStatus?.toLowerCase() === 'pending')
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const openAddModal = () => {
    setEditingBill(null);
    setFormData({
      billId: `BIL-${Math.floor(100 + Math.random() * 900)}`,
      patientId: patients.length > 0 ? patients[0].patientId : '',
      appointmentId: appointments.length > 0 ? appointments[0].appointmentId : '',
      amount: '150.00',
      paymentStatus: 'Pending',
      billDate: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (bill) => {
    setEditingBill(bill);
    setFormData({
      billId: bill.billId,
      patientId: bill.patientId,
      appointmentId: bill.appointmentId,
      amount: bill.amount,
      paymentStatus: bill.paymentStatus,
      billDate: bill.billDate,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (editingBill) {
        await updateBill(editingBill.billId || editingBill.id, payload);
        showToast('Billing invoice updated successfully!', 'success');
      } else {
        await createBill(payload);
        showToast('Bill generated and saved to MongoDB Atlas!', 'success');
      }
      setIsModalOpen(false);
      loadBills();
    } catch (err) {
      showToast(err.message || 'Failed to process bill', 'error');
    }
  };

  const handleDelete = async (bill) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete invoice ${bill.billId}?`);
    if (!confirmDelete) return;

    try {
      await deleteBill(bill.billId || bill.id);
      showToast('Bill deleted successfully', 'success');
      loadBills();
    } catch (err) {
      showToast(err.message || 'Failed to delete bill', 'error');
    }
  };

  return (
    <div>
      {/* Billing Overview Summary */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-info">
            <span>Total Invoices</span>
            <h3>{bills.length}</h3>
            <p>Generated to date</p>
          </div>
          <div className="stat-icon icon-blue">
            <Receipt size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span>Collected Revenue</span>
            <h3 style={{ color: '#059669' }}>
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <p>From completed payments</p>
          </div>
          <div className="stat-icon icon-emerald">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span>Pending Receivables</span>
            <h3 style={{ color: '#d97706' }}>
              ${pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <p>Awaiting settlement</p>
          </div>
          <div className="stat-icon icon-purple">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <h3>Billing & Invoices</h3>
            <p>Manage patient consultation fees, hospital charges, and invoice payment statuses</p>
          </div>

          <div className="controls-bar">
            <button className="btn btn-secondary" onClick={loadBills} title="Refresh">
              <RefreshCw size={15} /> Refresh
            </button>

            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={16} /> Generate Invoice
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Patient ID</th>
                <th>Appointment ID</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Bill Date</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    Loading billing records from MongoDB Atlas...
                  </td>
                </tr>
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <CreditCard size={40} />
                      <h4>No Invoices Found</h4>
                      <p>Generate an invoice for patient appointments or consultations.</p>
                      <button className="btn btn-primary btn-sm" onClick={openAddModal}>
                        Generate Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.id || bill.billId}>
                    <td><strong style={{ color: '#0284c7' }}>{bill.billId}</strong></td>
                    <td style={{ fontWeight: 600 }}>{bill.patientId}</td>
                    <td>{bill.appointmentId}</td>
                    <td style={{ fontWeight: 700, fontSize: '15px' }}>
                      ${Number(bill.amount || 0).toFixed(2)}
                    </td>
                    <td>
                      <StatusBadge status={bill.paymentStatus} />
                    </td>
                    <td>{bill.billDate}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button 
                          className="btn-icon" 
                          onClick={() => openEditModal(bill)} 
                          title="Edit Bill"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(bill)} 
                          title="Delete Bill"
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

      {/* Add / Edit Bill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBill ? `Edit Invoice (${editingBill.billId})` : 'Generate New Invoice'}
      >
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Bill ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.billId}
                  onChange={(e) => setFormData({ ...formData, billId: e.target.value })}
                  disabled={!!editingBill}
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
                <label className="form-label">Appointment ID</label>
                {appointments.length > 0 ? (
                  <select
                    className="form-control"
                    value={formData.appointmentId}
                    onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                    required
                  >
                    <option value="">Select an Appointment</option>
                    {appointments.map((a) => (
                      <option key={a.appointmentId} value={a.appointmentId}>
                        {a.appointmentId} (Patient: {a.patientId})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g. APT-101"
                    className="form-control"
                    value={formData.appointmentId}
                    onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                    required
                  />
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g. 150.00"
                  className="form-control"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Status</label>
                <select
                  className="form-control"
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Invoice Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.billDate}
                  onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
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
              {editingBill ? 'Save Changes' : 'Generate Bill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

// Response interceptor for beginner-friendly error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = 'An unexpected error occurred';
    if (error.response && error.response.data) {
      const { message, data } = error.response.data;
      if (typeof data === 'object' && data !== null) {
        errorMessage = Object.values(data).join('; ');
      } else if (message) {
        errorMessage = message;
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      errorMessage = 'Request timed out: Server might be waking up or MongoDB connection is pending. Please retry in a moment.';
    } else if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
      errorMessage = 'Cannot reach backend. Please ensure the backend server is running and CORS is configured.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth Service
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);
export const signupUser = (userData) => apiClient.post('/auth/signup', userData);

// Health check
export const checkHealth = () => apiClient.get('/health');

// Dashboard
export const getDashboardStats = () => apiClient.get('/dashboard/stats');

// Patient Management
export const getPatients = () => apiClient.get('/patients');
export const searchPatients = (name) => apiClient.get(`/patients/search?name=${encodeURIComponent(name || '')}`);
export const getPatientById = (id) => apiClient.get(`/patients/${id}`);
export const createPatient = (patient) => apiClient.post('/patients', patient);
export const updatePatient = (id, patient) => apiClient.put(`/patients/${id}`, patient);
export const deletePatient = (id) => apiClient.delete(`/patients/${id}`);

// Doctor Management
export const getDoctors = () => apiClient.get('/doctors');
export const getDoctorById = (id) => apiClient.get(`/doctors/${id}`);
export const createDoctor = (doctor) => apiClient.post('/doctors', doctor);
export const updateDoctor = (id, doctor) => apiClient.put(`/doctors/${id}`, doctor);
export const deleteDoctor = (id) => apiClient.delete(`/doctors/${id}`);

// Appointment Management
export const getAppointments = (params = {}) => {
  const query = new URLSearchParams();
  if (params.date) query.append('date', params.date);
  if (params.status) query.append('status', params.status);
  const queryString = query.toString();
  return apiClient.get(`/appointments${queryString ? `?${queryString}` : ''}`);
};
export const getAppointmentById = (id) => apiClient.get(`/appointments/${id}`);
export const createAppointment = (appointment) => apiClient.post('/appointments', appointment);
export const updateAppointment = (id, appointment) => apiClient.put(`/appointments/${id}`, appointment);
export const deleteAppointment = (id) => apiClient.delete(`/appointments/${id}`);

// Billing Management
export const getBills = () => apiClient.get('/bills');
export const getBillById = (id) => apiClient.get(`/bills/${id}`);
export const createBill = (bill) => apiClient.post('/bills', bill);
export const updateBill = (id, bill) => apiClient.put(`/bills/${id}`, bill);
export const deleteBill = (id) => apiClient.delete(`/bills/${id}`);

export default apiClient;

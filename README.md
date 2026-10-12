# Hospital Management System (HMS)

> A modern, full-stack Hospital Management System built with Java Spring Boot, MongoDB Atlas, React, and Vite. Designed for hospital administration, staff workflows, patient records, appointment scheduling, and billing management.

---

## 1. Project Title and Introduction

**Project Title:** MediCare Hospital Management System (HMS)  
**Introduction:**  
Healthcare facilities require reliable, real-time management of patients, medical specialists, appointment schedules, and financial invoicing. The Hospital Management System provides a secure, reactive, and responsive full-stack platform that replaces paper records with persistent cloud storage in MongoDB Atlas and intuitive web dashboards.

---

## 2. Problem Statement

Traditional hospital record keeping often encounters several pain points:
- Physical paperwork and fragmented records lead to lost medical records and scheduling conflicts.
- Delays in patient admission, doctor consultation coordination, and invoice generation.
- Lack of centralized real-time insights into patient count, active medical staff, and pending revenue.
- Security and persistence risks when data is stored in unverified local files.

---

## 3. Project Objectives

1. **Digital Patient Records:** Seamless patient onboarding with contact details, age, residential address, and clinical symptoms.
2. **Specialist Doctor Coordination:** Directory of doctor specializations, office hours, and consultation availability.
3. **Appointment Scheduling:** Interactive scheduling linking specific patients to doctors with date, time, and status tracking.
4. **Billing and Revenue Tracking:** Generating bills linked to patients/appointments with payment status (`Paid` vs `Pending`) and automated revenue calculation.
5. **Real-Time Administrative Dashboard:** Summary statistics (total patients, doctors, appointments, pending bills, revenue).
6. **Cloud Database Persistence:** Scalable NoSQL storage on MongoDB Atlas with clear separation of collections.

---

## 4. Technology Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Routing:** React Router v7 (`react-router-dom`)
- **API Client:** Axios with request/response interceptors
- **Icons:** Lucide React (`lucide-react`)
- **Styling:** Custom Clean CSS design system (medical blue aesthetic, glassmorphism modals, status badges, responsive grid)

### Backend
- **Language & Runtime:** Java 21 (LTS)
- **Framework:** Spring Boot 3.3.4
- **Modules:**
  - `spring-boot-starter-web` (RESTful APIs & embedded Tomcat)
  - `spring-boot-starter-data-mongodb` (MongoRepository & object mapping)
  - `spring-boot-starter-validation` (Jakarta validation annotations)
  - `spring-boot-devtools` (Hot reload during development)
- **Build Tool:** Apache Maven 3.9 (with Maven Wrapper `mvnw`)

### Database
- **Engine:** MongoDB Atlas Cloud NoSQL Database
- **Database Name:** `hospital_management`
- **Driver:** MongoDB Java Reactive & Sync Driver 5.0.1

---

## 5. System Architecture

```text
+-------------------------------------------------------------------------+
|                          CLIENT BROWSER                                 |
|      React 19 + Vite Dashboard (http://localhost:5173)                  |
|  [Dashboard] [Patients] [Doctors] [Appointments] [Billing]              |
+------------------------------------+------------------------------------+
                                     |
                                     | REST API (JSON / HTTP)
                                     | Axios Client (Base URL: http://localhost:8080/api)
                                     v
+-------------------------------------------------------------------------+
|                        SPRING BOOT BACKEND                              |
|                   (http://localhost:8080)                               |
|                                                                         |
|  [Controllers]   PatientController | DoctorController | Appointment...  |
|         |                                                               |
|  [Services]      Business logic, duplicate validation, cascade rules   |
|         |                                                               |
|  [Repositories]  PatientRepository | DoctorRepository | MongoRepository |
|         |                                                               |
|  [Global Exception Handler] Unified JSON error formatting & 503 catch   |
+------------------------------------+------------------------------------+
                                     |
                                     | MongoDB Wire Protocol (TLS / SRV)
                                     | MONGODB_URI Environment Variable
                                     v
+-------------------------------------------------------------------------+
|                         MONGODB ATLAS                                   |
|                Database: hospital_management                            |
|                                                                         |
|  Collection: patients     Collection: doctors                           |
|  Collection: appointments Collection: bills                             |
+-------------------------------------------------------------------------+
```

---

## 6. Database Collections Overview

All collections reside within the **`hospital_management`** database:

| Collection Name | Document Model | Key Fields | Description |
|---|---|---|---|
| **`patients`** | `Patient.java` | `patientId` (unique), `fullName`, `age`, `gender`, `phone`, `address`, `symptoms` | Stores registered hospital patients. |
| **`doctors`** | `Doctor.java` | `doctorId` (unique), `fullName`, `specialization`, `phone`, `email`, `availability` | Stores medical doctors and specialties. |
| **`appointments`** | `Appointment.java` | `appointmentId` (unique), `patientId`, `doctorId`, `appointmentDate`, `appointmentTime`, `status` | Stores scheduled, completed, and cancelled visits. |
| **`bills`** | `Billing.java` | `billId` (unique), `patientId`, `appointmentId`, `amount`, `paymentStatus`, `billDate` | Stores invoices, payments, and fees. |

### Data Integrity & Cascade Rules
- **Patient Deletion:** Automatically cascades and removes associated appointments and bills for that patient, preventing orphaned records.
- **Doctor Deletion:** Automatically cleans up scheduled appointments associated with that doctor.

---

## 7. Folder Structure

```text
hospital-management-system/
├── backend/
│   ├── .mvn/wrapper/                  # Maven Wrapper binaries
│   ├── mvnw / mvnw.cmd                # Maven Wrapper executables
│   ├── pom.xml                        # Maven dependencies & build plugins
│   ├── .env.example                   # Connection string template
│   └── src/
│       ├── main/
│       │   ├── java/com/hospital/hms/
│       │   │   ├── HospitalManagementSystemApplication.java
│       │   │   ├── config/
│       │   │   │   ├── CorsConfig.java           # CORS enabled for localhost:5173
│       │   │   │   └── MongoConfig.java          # MongoRepository scan configuration
│       │   │   ├── controller/
│       │   │   │   ├── PatientController.java    # /api/patients
│       │   │   │   ├── DoctorController.java     # /api/doctors
│       │   │   │   ├── AppointmentController.java# /api/appointments
│       │   │   │   ├── BillingController.java    # /api/bills
│       │   │   │   └── DashboardController.java  # /api/health & /api/dashboard/stats
│       │   │   ├── exception/
│       │   │   │   ├── ResourceNotFoundException.java
│       │   │   │   ├── DuplicateResourceException.java
│       │   │   │   └── GlobalExceptionHandler.java
│       │   │   ├── model/
│       │   │   │   ├── Patient.java
│       │   │   │   ├── Doctor.java
│       │   │   │   ├── Appointment.java
│       │   │   │   ├── Billing.java
│       │   │   │   └── ApiResponse.java          # {success, message, data, timestamp}
│       │   │   ├── repository/
│       │   │   │   ├── PatientRepository.java
│       │   │   │   ├── DoctorRepository.java
│       │   │   │   ├── AppointmentRepository.java
│       │   │   │   └── BillingRepository.java
│       │   │   └── service/
│       │   │       ├── PatientService.java
│       │   │       ├── DoctorService.java
│       │   │       ├── AppointmentService.java
│       │   │       └── BillingService.java
│       │   └── resources/
│       │       └── application.properties        # Reads MONGODB_URI dynamically
│       └── test/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js                            # Axios API module with baseURL
│   │   ├── components/
│   │   │   ├── Navbar.jsx                        # Top bar with route title & badges
│   │   │   ├── Sidebar.jsx                       # Left sidebar with React Router NavLinks
│   │   │   ├── Modal.jsx                         # Accessible form dialogs
│   │   │   └── StatusBadge.jsx                   # Color-coded pill badges
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx                 # Dynamic metrics & recent appointments
│   │   │   ├── PatientsPage.jsx                  # Table, registration, search, edit, delete
│   │   │   ├── DoctorsPage.jsx                   # Directory, search, availability, CRUD
│   │   │   ├── AppointmentsPage.jsx              # Booking, date/status filtering, cancellation
│   │   │   └── BillingPage.jsx                   # Invoicing, revenue calculations, status toggle
│   │   ├── App.jsx                               # Router configuration & notifications
│   │   ├── index.css                             # Hospital design system
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── start-all.bat                                 # Starts both servers simultaneously
├── start-backend.bat                             # Starts Spring Boot on port 8080
├── start-frontend.bat                            # Starts Vite on port 5173
└── README.md
```

---

## 8. MongoDB Atlas Configuration Steps

Follow these steps to connect your MongoDB Atlas cloud database:

### Step 1: Create an Atlas Account & Cluster
1. Navigate to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free account.
2. Create a free shared cluster (**M0 Free Tier**).

### Step 2: Configure Network Access
1. In the left navigation, select **Security** -> **Network Access**.
2. Click **Add IP Address**.
3. Choose **Allow Access from Anywhere** (`0.0.0.0/0`) or enter your current IP.
4. Click **Confirm**.

### Step 3: Create a Database User
1. In the left navigation, select **Security** -> **Database Access**.
2. Click **Add New Database User**.
3. Choose **Password** authentication.
4. Enter a Username (e.g., `hms_user`) and a secure Password (e.g., `HospitalSecure123!`).
5. Set Database User Privileges to **Read and write to any database**.
6. Click **Add User**.

### Step 4: Get Your Connection String
1. Under **Deployment**, click **Database**.
2. Click the **Connect** button on your cluster.
3. Select **Drivers** (Driver: `Java`).
4. Copy the connection string. It will look like:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Specify the database name by inserting `hospital_management` before the query parameter:
   ```text
   mongodb+srv://hms_user:HospitalSecure123!@cluster0.abcde.mongodb.net/hospital_management?retryWrites=true&w=majority
   ```

### Step 5: Set the Environment Variable on Windows

#### Option A: Current PowerShell Session
```powershell
$env:MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/hospital_management?retryWrites=true&w=majority"
```

#### Option B: Persistent User Environment Variable (Windows)
```powershell
[System.Environment]::SetEnvironmentVariable('MONGODB_URI', 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/hospital_management?retryWrites=true&w=majority', 'User')
```

#### Option C: Command Prompt (cmd.exe)
```cmd
set MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hospital_management?retryWrites=true&w=majority
```

> **Security Note:** Never commit database credentials or connection strings with passwords to Git. The project uses `.env.example` templates and reads credentials securely from the environment.

---

## 9. Backend Setup and Execution

### Running the Backend
From the project root:

```powershell
cd hospital-management-system/backend

# Using the included Maven Wrapper:
.\mvnw.cmd spring-boot:run

# Or run the pre-compiled JAR:
java -jar target/hospital-management-system-backend-0.0.1-SNAPSHOT.jar
```

The Spring Boot backend will start on **`http://localhost:8080`**.

### Verify Backend Health
Open your browser or PowerShell:
```powershell
Invoke-RestMethod http://localhost:8080/api/health
```
Response:
```json
{
  "success": true,
  "message": "Hospital Management System Backend is running smoothly",
  "data": {
    "port": "8080",
    "backend": "Spring Boot 3.3.4",
    "status": "UP"
  }
}
```

---

## 10. Frontend Setup and Execution

### Running the Frontend
In a second terminal window:

```powershell
cd hospital-management-system/frontend

# Install dependencies (already installed):
npm install

# Start Vite dev server:
npm run dev
```

The frontend will start on **`http://localhost:5173`**.

---

## 11. REST API Endpoint Reference

All endpoints return uniform JSON responses:
```json
{
  "success": true,
  "message": "Descriptive status message",
  "data": { ... },
  "timestamp": "2026-10-12T14:40:00"
}
```

### Health & Dashboard APIs
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Instant health check (independent of DB) |
| `GET` | `/api/dashboard/stats` | Aggregated counts & revenue statistics |

### Patients (`/api/patients`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/patients` | Register new patient (validates `@NotBlank`, `@Min`, `@Max`) |
| `GET` | `/api/patients` | Retrieve all patients |
| `GET` | `/api/patients/{id}` | Find patient by `patientId` or MongoDB `_id` |
| `GET` | `/api/patients/search?name={name}` | Case-insensitive patient name search |
| `PUT` | `/api/patients/{id}` | Update existing patient details |
| `DELETE` | `/api/patients/{id}` | Delete patient (cascades associated appointments and bills) |

### Doctors (`/api/doctors`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/doctors` | Register specialist doctor (`@Email` validated) |
| `GET` | `/api/doctors` | Retrieve all doctors |
| `GET` | `/api/doctors/{id}` | Find doctor by ID |
| `PUT` | `/api/doctors/{id}` | Update doctor schedule and details |
| `DELETE` | `/api/doctors/{id}` | Delete doctor (cleans up associated appointments) |

### Appointments (`/api/appointments`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/appointments` | Book appointment linked to patient and doctor |
| `GET` | `/api/appointments` | Get appointments (supports query `?date=...&status=...`) |
| `GET` | `/api/appointments/filter` | Filter appointments by date and/or status |
| `GET` | `/api/appointments/{id}` | Get appointment by ID |
| `PUT` | `/api/appointments/{id}` | Update appointment date, time, or status |
| `DELETE` | `/api/appointments/{id}` | Cancel / delete appointment |

### Billing (`/api/bills` or `/api/billing`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bills` | Generate invoice with positive amount |
| `GET` | `/api/bills` | Retrieve all billing records |
| `GET` | `/api/bills/{id}` | Get invoice by ID |
| `PUT` | `/api/bills/{id}` | Update amount or toggle payment status (`Paid` / `Pending`) |
| `DELETE` | `/api/bills/{id}` | Remove invoice record |

---

## 12. Faculty Demonstration Sequence

Follow this sequence during your project evaluation:

1. **Start Both Servers:**
   - Double-click [`start-all.bat`](file:///c:/Users/natha/OneDrive/Desktop/HMS/start-all.bat) or run backend on `8080` and frontend on `5173`.
   - Open browser at `http://localhost:5173`.

2. **Demonstrate Dashboard:**
   - Show the summary cards: Total Patients, Doctors, Appointments, and Pending Invoices.
   - Explain the live system status badges (Spring Boot online on port 8080, MongoDB Atlas connected).

3. **Step 1: Register a Patient:**
   - Click **Patients** in the sidebar.
   - Click **Register Patient**.
   - Input:
     - Name: `Sarah Jenkins`
     - Age: `34`
     - Gender: `Female`
     - Phone: `+1 555-0144`
     - Address: `742 Evergreen Terrace`
     - Symptoms: `Fever and persistent headache`
   - Click **Register Patient**. Notice the success notification and the new row in the table.
   - Use the **Search bar** to search `Sarah` and demonstrate real-time server-side name filtering.

4. **Step 2: Add a Doctor:**
   - Click **Doctors** in the sidebar.
   - Click **Add Doctor**.
   - Input:
     - Doctor ID: `DOC-101`
     - Name: `Marcus Vance`
     - Specialization: `Cardiology`
     - Phone: `+1 555-0199`
     - Email: `dr.vance@hospital.com`
     - Availability: `Mon - Fri (09:00 AM - 04:00 PM)`
   - Click **Add Doctor**.

5. **Step 3: Book an Appointment:**
   - Click **Appointments** in the sidebar.
   - Click **Book Appointment**.
   - The form dropdown automatically shows registered patient `Sarah Jenkins` and doctor `Dr. Marcus Vance`.
   - Select date and time, status: `Scheduled`.
   - Click **Confirm Booking**.
   - Show how the **Date filter** and **Status filter** filter appointments in real time.

6. **Step 4: Generate a Bill:**
   - Click **Billing** in the sidebar.
   - Click **Generate Invoice**.
   - Select the patient and appointment, set Amount: `$250.00`, Status: `Pending`.
   - Click **Generate Bill**.
   - Click **Edit** on the bill, toggle status to `Paid`.
   - Show how the collected revenue updates on the billing dashboard card and main dashboard.

7. **Step 5: Demonstrate Data Persistence:**
   - Stop and restart the Spring Boot backend (`java -jar ...` or `start-backend.bat`).
   - Refresh the React page in the browser.
   - Point out that all patients, doctors, appointments, and bills remain intact because they are saved in MongoDB Atlas.

---

## 13. Short Presentation Script for Faculty

> *"Good morning/afternoon, professors. Today I am presenting the **MediCare Hospital Management System**, a full-stack clinical platform developed with **Spring Boot 3.3.4**, **MongoDB Atlas**, and **React with Vite**.*
> 
> *The application resolves the latency and errors associated with manual hospital workflows. On the backend, we followed industry-standard layered architecture: separate Controllers for REST API routing, Services for business logic and cascade deletions, Repositories utilizing Spring Data MongoDB, Document Models with Jakarta field validation, and a centralized Global Exception Handler.*
> 
> *For cloud storage, we use MongoDB Atlas with the `hospital_management` database, organizing records into four distinct collections: `patients`, `doctors`, `appointments`, and `bills`. The connection string is decoupled using the `MONGODB_URI` environment variable to ensure zero credentials are ever committed to version control.*
> 
> *On the frontend, we built an accessible, responsive dashboard with React Router navigation, Axios HTTP services with automatic error interception, real-time search, filterable appointment calendars, and automated billing calculation.*
> 
> *Let me demonstrate the live workflow..."*

---

## 14. Future Enhancements

- Role-based Access Control (RBAC) with Spring Security and JWT tokens (Admin, Doctor, Receptionist, Patient).
- PDF invoice generation and download for billing receipts.
- SMS and email appointment reminders using Twilio / SendGrid APIs.
- Medical laboratory test reports and prescription file uploads using AWS S3 or GridFS.

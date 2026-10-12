package com.hospital.hms.service;

import com.hospital.hms.exception.DuplicateResourceException;
import com.hospital.hms.exception.ResourceNotFoundException;
import com.hospital.hms.model.Patient;
import com.hospital.hms.repository.AppointmentRepository;
import com.hospital.hms.repository.BillingRepository;
import com.hospital.hms.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final BillingRepository billingRepository;

    public PatientService(PatientRepository patientRepository,
                          AppointmentRepository appointmentRepository,
                          BillingRepository billingRepository) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.billingRepository = billingRepository;
    }

    public Patient addPatient(Patient patient) {
        if (patientRepository.existsByPatientId(patient.getPatientId())) {
            throw new DuplicateResourceException("Patient already exists with Patient ID: " + patient.getPatientId());
        }
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(String identifier) {
        return patientRepository.findByPatientId(identifier)
                .or(() -> patientRepository.findById(identifier))
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + identifier));
    }

    public Patient updatePatient(String identifier, Patient updatedData) {
        Patient existingPatient = getPatientById(identifier);

        existingPatient.setFullName(updatedData.getFullName());
        existingPatient.setAge(updatedData.getAge());
        existingPatient.setGender(updatedData.getGender());
        existingPatient.setPhone(updatedData.getPhone());
        existingPatient.setAddress(updatedData.getAddress());
        existingPatient.setSymptoms(updatedData.getSymptoms());

        return patientRepository.save(existingPatient);
    }

    public void deletePatient(String identifier) {
        Patient existingPatient = getPatientById(identifier);
        String pId = existingPatient.getPatientId();

        // Consistent relationship handling:
        // Automatically cascade delete all associated appointments and bills for this patient
        // to prevent dangling or orphaned records in MongoDB Atlas
        if (pId != null && !pId.isEmpty()) {
            appointmentRepository.findByPatientId(pId).forEach(appointmentRepository::delete);
            billingRepository.findByPatientId(pId).forEach(billingRepository::delete);
        }

        patientRepository.delete(existingPatient);
    }

    public List<Patient> searchPatientsByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return getAllPatients();
        }
        return patientRepository.findByFullNameContainingIgnoreCase(name.trim());
    }

    public long countPatients() {
        return patientRepository.count();
    }
}

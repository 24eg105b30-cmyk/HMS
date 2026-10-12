package com.hospital.hms.service;

import com.hospital.hms.exception.DuplicateResourceException;
import com.hospital.hms.exception.ResourceNotFoundException;
import com.hospital.hms.model.Doctor;
import com.hospital.hms.repository.AppointmentRepository;
import com.hospital.hms.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public DoctorService(DoctorRepository doctorRepository, AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Doctor addDoctor(Doctor doctor) {
        if (doctorRepository.existsByDoctorId(doctor.getDoctorId())) {
            throw new DuplicateResourceException("Doctor already exists with Doctor ID: " + doctor.getDoctorId());
        }
        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(String identifier) {
        return doctorRepository.findByDoctorId(identifier)
                .or(() -> doctorRepository.findById(identifier))
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + identifier));
    }

    public Doctor updateDoctor(String identifier, Doctor updatedData) {
        Doctor existingDoctor = getDoctorById(identifier);

        existingDoctor.setFullName(updatedData.getFullName());
        existingDoctor.setSpecialization(updatedData.getSpecialization());
        existingDoctor.setPhone(updatedData.getPhone());
        existingDoctor.setEmail(updatedData.getEmail());
        existingDoctor.setAvailability(updatedData.getAvailability());

        return doctorRepository.save(existingDoctor);
    }

    public void deleteDoctor(String identifier) {
        Doctor existingDoctor = getDoctorById(identifier);
        String docId = existingDoctor.getDoctorId();

        // Consistent relationship handling:
        // Automatically clean up associated appointments for this doctor
        if (docId != null && !docId.isEmpty()) {
            appointmentRepository.findByDoctorId(docId).forEach(appointmentRepository::delete);
        }

        doctorRepository.delete(existingDoctor);
    }

    public long countDoctors() {
        return doctorRepository.count();
    }
}

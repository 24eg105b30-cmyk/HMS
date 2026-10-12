package com.hospital.hms.service;

import com.hospital.hms.exception.DuplicateResourceException;
import com.hospital.hms.exception.ResourceNotFoundException;
import com.hospital.hms.model.Appointment;
import com.hospital.hms.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment addAppointment(Appointment appointment) {
        if (appointmentRepository.existsByAppointmentId(appointment.getAppointmentId())) {
            throw new DuplicateResourceException("Appointment already exists with Appointment ID: " + appointment.getAppointmentId());
        }
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(String identifier) {
        return appointmentRepository.findByAppointmentId(identifier)
                .or(() -> appointmentRepository.findById(identifier))
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + identifier));
    }

    public Appointment updateAppointment(String identifier, Appointment updatedData) {
        Appointment existing = getAppointmentById(identifier);

        existing.setPatientId(updatedData.getPatientId());
        existing.setDoctorId(updatedData.getDoctorId());
        existing.setAppointmentDate(updatedData.getAppointmentDate());
        existing.setAppointmentTime(updatedData.getAppointmentTime());
        existing.setStatus(updatedData.getStatus());

        return appointmentRepository.save(existing);
    }

    public void deleteAppointment(String identifier) {
        Appointment existing = getAppointmentById(identifier);
        appointmentRepository.delete(existing);
    }

    public List<Appointment> filterAppointments(String date, String status) {
        boolean hasDate = date != null && !date.trim().isEmpty();
        boolean hasStatus = status != null && !status.trim().isEmpty();

        if (hasDate && hasStatus) {
            return appointmentRepository.findByAppointmentDateAndStatusIgnoreCase(date.trim(), status.trim());
        } else if (hasDate) {
            return appointmentRepository.findByAppointmentDate(date.trim());
        } else if (hasStatus) {
            return appointmentRepository.findByStatusIgnoreCase(status.trim());
        } else {
            return appointmentRepository.findAll();
        }
    }

    public long countAppointments() {
        return appointmentRepository.count();
    }
}

package com.hospital.hms.repository;

import com.hospital.hms.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {

    Optional<Appointment> findByAppointmentId(String appointmentId);

    List<Appointment> findByAppointmentDate(String appointmentDate);

    List<Appointment> findByStatusIgnoreCase(String status);

    List<Appointment> findByAppointmentDateAndStatusIgnoreCase(String appointmentDate, String status);

    List<Appointment> findByPatientId(String patientId);

    List<Appointment> findByDoctorId(String doctorId);

    boolean existsByAppointmentId(String appointmentId);

    void deleteByAppointmentId(String appointmentId);
}

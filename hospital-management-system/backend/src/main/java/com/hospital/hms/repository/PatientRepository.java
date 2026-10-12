package com.hospital.hms.repository;

import com.hospital.hms.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {

    Optional<Patient> findByPatientId(String patientId);

    List<Patient> findByFullNameContainingIgnoreCase(String fullName);

    boolean existsByPatientId(String patientId);

    void deleteByPatientId(String patientId);
}

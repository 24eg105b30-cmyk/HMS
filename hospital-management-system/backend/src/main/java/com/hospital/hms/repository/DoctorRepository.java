package com.hospital.hms.repository;

import com.hospital.hms.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {

    Optional<Doctor> findByDoctorId(String doctorId);

    List<Doctor> findByFullNameContainingIgnoreCase(String fullName);

    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);

    boolean existsByDoctorId(String doctorId);

    void deleteByDoctorId(String doctorId);
}

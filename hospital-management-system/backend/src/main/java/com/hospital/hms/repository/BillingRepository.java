package com.hospital.hms.repository;

import com.hospital.hms.model.Billing;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillingRepository extends MongoRepository<Billing, String> {

    Optional<Billing> findByBillId(String billId);

    List<Billing> findByPatientId(String patientId);

    List<Billing> findByAppointmentId(String appointmentId);

    List<Billing> findByPaymentStatusIgnoreCase(String paymentStatus);

    boolean existsByBillId(String billId);

    void deleteByBillId(String billId);
}

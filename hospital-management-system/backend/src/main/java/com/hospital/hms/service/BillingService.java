package com.hospital.hms.service;

import com.hospital.hms.exception.DuplicateResourceException;
import com.hospital.hms.exception.ResourceNotFoundException;
import com.hospital.hms.model.Billing;
import com.hospital.hms.repository.BillingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillingService {

    private final BillingRepository billingRepository;

    public BillingService(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    public Billing addBill(Billing bill) {
        if (billingRepository.existsByBillId(bill.getBillId())) {
            throw new DuplicateResourceException("Bill already exists with Bill ID: " + bill.getBillId());
        }
        return billingRepository.save(bill);
    }

    public List<Billing> getAllBills() {
        return billingRepository.findAll();
    }

    public Billing getBillById(String identifier) {
        return billingRepository.findByBillId(identifier)
                .or(() -> billingRepository.findById(identifier))
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with ID: " + identifier));
    }

    public Billing updateBill(String identifier, Billing updatedData) {
        Billing existing = getBillById(identifier);

        existing.setPatientId(updatedData.getPatientId());
        existing.setAppointmentId(updatedData.getAppointmentId());
        existing.setAmount(updatedData.getAmount());
        existing.setPaymentStatus(updatedData.getPaymentStatus());
        existing.setBillDate(updatedData.getBillDate());

        return billingRepository.save(existing);
    }

    public void deleteBill(String identifier) {
        Billing existing = getBillById(identifier);
        billingRepository.delete(existing);
    }

    public long countBills() {
        return billingRepository.count();
    }

    public double calculateTotalRevenue() {
        return billingRepository.findAll().stream()
                .filter(b -> "Paid".equalsIgnoreCase(b.getPaymentStatus()))
                .mapToDouble(b -> b.getAmount() != null ? b.getAmount() : 0.0)
                .sum();
    }
}

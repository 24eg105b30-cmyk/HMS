package com.hospital.hms.controller;

import com.hospital.hms.model.ApiResponse;
import com.hospital.hms.model.Billing;
import com.hospital.hms.service.BillingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/bills", "/api/billing"})
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    // 1. Add a new bill
    @PostMapping
    public ResponseEntity<ApiResponse<Billing>> addBill(@Valid @RequestBody Billing bill) {
        Billing saved = billingService.addBill(bill);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(saved, "Bill generated successfully"));
    }

    // 2. Get all bills
    @GetMapping
    public ResponseEntity<ApiResponse<List<Billing>>> getAllBills() {
        List<Billing> bills = billingService.getAllBills();
        return ResponseEntity.ok(ApiResponse.success(bills, "Fetched all bills successfully"));
    }

    // 3. Get bill by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Billing>> getBillById(@PathVariable String id) {
        Billing bill = billingService.getBillById(id);
        return ResponseEntity.ok(ApiResponse.success(bill, "Bill found"));
    }

    // 4. Update bill
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Billing>> updateBill(@PathVariable String id, @Valid @RequestBody Billing bill) {
        Billing updated = billingService.updateBill(id, bill);
        return ResponseEntity.ok(ApiResponse.success(updated, "Bill updated successfully"));
    }

    // 5. Delete bill
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteBill(@PathVariable String id) {
        billingService.deleteBill(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", "Bill deleted successfully"));
    }
}

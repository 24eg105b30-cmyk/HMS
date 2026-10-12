package com.hospital.hms.controller;

import com.hospital.hms.model.ApiResponse;
import com.hospital.hms.service.AppointmentService;
import com.hospital.hms.service.BillingService;
import com.hospital.hms.service.DoctorService;
import com.hospital.hms.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final PatientService patientService;
    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final BillingService billingService;

    public DashboardController(PatientService patientService,
                               DoctorService doctorService,
                               AppointmentService appointmentService,
                               BillingService billingService) {
        this.patientService = patientService;
        this.doctorService = doctorService;
        this.appointmentService = appointmentService;
        this.billingService = billingService;
    }

    // Direct health check endpoint that does not block on DB
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, String>>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("backend", "Spring Boot 3.3.4");
        status.put("port", "8080");
        return ResponseEntity.ok(ApiResponse.success(status, "Hospital Management System Backend is running smoothly"));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", patientService.countPatients());
        stats.put("totalDoctors", doctorService.countDoctors());
        stats.put("totalAppointments", appointmentService.countAppointments());
        stats.put("totalBills", billingService.countBills());
        stats.put("totalRevenue", billingService.calculateTotalRevenue());

        return ResponseEntity.ok(ApiResponse.success(stats, "Dashboard statistics loaded"));
    }
}

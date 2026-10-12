package com.hospital.hms.controller;

import com.hospital.hms.model.ApiResponse;
import com.hospital.hms.model.Doctor;
import com.hospital.hms.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // 1. Add a new doctor
    @PostMapping
    public ResponseEntity<ApiResponse<Doctor>> addDoctor(@Valid @RequestBody Doctor doctor) {
        Doctor saved = doctorService.addDoctor(doctor);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(saved, "Doctor added successfully"));
    }

    // 2. Get all doctors
    @GetMapping
    public ResponseEntity<ApiResponse<List<Doctor>>> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(ApiResponse.success(doctors, "Fetched all doctors successfully"));
    }

    // 3. Get doctor by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Doctor>> getDoctorById(@PathVariable String id) {
        Doctor doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success(doctor, "Doctor found"));
    }

    // 4. Update doctor
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Doctor>> updateDoctor(@PathVariable String id, @Valid @RequestBody Doctor doctor) {
        Doctor updated = doctorService.updateDoctor(id, doctor);
        return ResponseEntity.ok(ApiResponse.success(updated, "Doctor updated successfully"));
    }

    // 5. Delete doctor
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDoctor(@PathVariable String id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", "Doctor deleted successfully"));
    }
}

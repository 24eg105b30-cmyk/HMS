package com.hospital.hms.controller;

import com.hospital.hms.model.ApiResponse;
import com.hospital.hms.model.Patient;
import com.hospital.hms.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // 1. Add a new patient
    @PostMapping
    public ResponseEntity<ApiResponse<Patient>> addPatient(@Valid @RequestBody Patient patient) {
        Patient saved = patientService.addPatient(patient);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(saved, "Patient registered successfully"));
    }

    // 2. Get all patients
    @GetMapping
    public ResponseEntity<ApiResponse<List<Patient>>> getAllPatients() {
        List<Patient> patients = patientService.getAllPatients();
        return ResponseEntity.ok(ApiResponse.success(patients, "Fetched all patients successfully"));
    }

    // 3. Search patients by name
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Patient>>> searchPatients(@RequestParam(required = false, defaultValue = "") String name) {
        List<Patient> results = patientService.searchPatientsByName(name);
        return ResponseEntity.ok(ApiResponse.success(results, "Found " + results.size() + " matching patient(s)"));
    }

    // 4. Get patient by ID (supports patientId or MongoDB ID)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> getPatientById(@PathVariable String id) {
        Patient patient = patientService.getPatientById(id);
        return ResponseEntity.ok(ApiResponse.success(patient, "Patient found"));
    }

    // 5. Update patient
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> updatePatient(@PathVariable String id, @Valid @RequestBody Patient patient) {
        Patient updated = patientService.updatePatient(id, patient);
        return ResponseEntity.ok(ApiResponse.success(updated, "Patient updated successfully"));
    }

    // 6. Delete patient
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deletePatient(@PathVariable String id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", "Patient deleted successfully"));
    }
}

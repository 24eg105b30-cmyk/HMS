package com.hospital.hms.controller;

import com.hospital.hms.model.ApiResponse;
import com.hospital.hms.model.Appointment;
import com.hospital.hms.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // 1. Add a new appointment
    @PostMapping
    public ResponseEntity<ApiResponse<Appointment>> addAppointment(@Valid @RequestBody Appointment appointment) {
        Appointment saved = appointmentService.addAppointment(appointment);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(saved, "Appointment booked successfully"));
    }

    // 2. Get all appointments (with optional query param filters: ?date=...&status=...)
    @GetMapping
    public ResponseEntity<ApiResponse<List<Appointment>>> getAllAppointments(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String status) {
        List<Appointment> appointments;
        if ((date != null && !date.trim().isEmpty()) || (status != null && !status.trim().isEmpty())) {
            appointments = appointmentService.filterAppointments(date, status);
        } else {
            appointments = appointmentService.getAllAppointments();
        }
        return ResponseEntity.ok(ApiResponse.success(appointments, "Fetched appointments successfully"));
    }

    // 3. Filter appointments explicitly by date or status
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<Appointment>>> filterAppointments(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String status) {
        List<Appointment> filtered = appointmentService.filterAppointments(date, status);
        return ResponseEntity.ok(ApiResponse.success(filtered, "Filtered " + filtered.size() + " appointment(s)"));
    }

    // 4. Get appointment by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Appointment>> getAppointmentById(@PathVariable String id) {
        Appointment appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(ApiResponse.success(appointment, "Appointment found"));
    }

    // 5. Update appointment
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Appointment>> updateAppointment(@PathVariable String id, @Valid @RequestBody Appointment appointment) {
        Appointment updated = appointmentService.updateAppointment(id, appointment);
        return ResponseEntity.ok(ApiResponse.success(updated, "Appointment updated successfully"));
    }

    // 6. Delete appointment
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAppointment(@PathVariable String id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", "Appointment deleted successfully"));
    }
}

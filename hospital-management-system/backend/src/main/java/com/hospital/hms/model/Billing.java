package com.hospital.hms.model;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bills")
public class Billing {

    @Id
    private String id;

    @NotBlank(message = "Bill ID is required")
    @Indexed(unique = true)
    private String billId;

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Appointment ID is required")
    private String appointmentId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private Double amount;

    @NotBlank(message = "Payment status is required (Paid, Pending, Overdue)")
    private String paymentStatus = "Pending";

    @NotBlank(message = "Bill date is required (YYYY-MM-DD)")
    private String billDate;

    public Billing() {
    }

    public Billing(String billId, String patientId, String appointmentId, Double amount, String paymentStatus, String billDate) {
        this.billId = billId;
        this.patientId = patientId;
        this.appointmentId = appointmentId;
        this.amount = amount;
        this.paymentStatus = paymentStatus != null ? paymentStatus : "Pending";
        this.billDate = billDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBillId() {
        return billId;
    }

    public void setBillId(String billId) {
        this.billId = billId;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(String appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getBillDate() {
        return billDate;
    }

    public void setBillDate(String billDate) {
        this.billDate = billDate;
    }

    @Override
    public String toString() {
        return "Billing{" +
                "id='" + id + '\'' +
                ", billId='" + billId + '\'' +
                ", patientId='" + patientId + '\'' +
                ", appointmentId='" + appointmentId + '\'' +
                ", amount=" + amount +
                ", paymentStatus='" + paymentStatus + '\'' +
                ", billDate='" + billDate + '\'' +
                '}';
    }
}

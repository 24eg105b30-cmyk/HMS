package com.hospital.hms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HospitalManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalManagementSystemApplication.class, args);
        System.out.println("==================================================");
        System.out.println("Hospital Management System Backend Started!");
        System.out.println("Access API at: http://localhost:8080/api");
        System.out.println("==================================================");
    }
}

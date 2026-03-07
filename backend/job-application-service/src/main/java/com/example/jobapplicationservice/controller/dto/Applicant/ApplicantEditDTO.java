package com.example.jobapplicationservice.controller.dto;

import com.example.jobapplicationservice.model.enums.UserRole;
import lombok.Data;

@Data
public class ApplicantEditDTO {
    private String firstName;
    private String lastName;
    private String emailAddress;
    private String phoneNumber;
    private UserRole role;
}

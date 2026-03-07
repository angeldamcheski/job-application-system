package com.example.jobapplicationservice.controller.dto;

import lombok.Data;

@Data
public class ApplicantDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String emailAddress;
    private String phoneNumber;
}

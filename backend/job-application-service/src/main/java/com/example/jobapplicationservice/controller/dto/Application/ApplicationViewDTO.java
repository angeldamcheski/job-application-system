package com.example.jobapplicationservice.controller.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ApplicationViewDTO {
    private Long id;
    private JobPostDTO jobPost;
    private ApplicantDTO applicant;
    private LocalDate submittedDate;
    private String preferredLanguage;
}

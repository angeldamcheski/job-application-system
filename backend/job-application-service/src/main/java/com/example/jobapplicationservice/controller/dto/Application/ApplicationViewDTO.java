package com.example.jobapplicationservice.controller.dto.Application;

import com.example.jobapplicationservice.controller.dto.Applicant.ApplicantDTO;
import com.example.jobapplicationservice.controller.dto.JobPost.JobPostDTO;
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

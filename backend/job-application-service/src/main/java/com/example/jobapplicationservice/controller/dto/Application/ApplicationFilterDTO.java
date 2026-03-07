package com.example.jobapplicationservice.controller.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
public class ApplicationFilterDTO {
    private Long jobPostId;
    private String applicantName;
    private String email;
    private String preferredLanguage;
    private LocalDate submittedFrom;
    private LocalDate submittedTo;
}

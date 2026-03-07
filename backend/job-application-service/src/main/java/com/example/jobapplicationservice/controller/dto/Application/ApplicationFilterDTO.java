package com.example.jobapplicationservice.controller.dto.Application;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

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

package com.example.jobapplicationservice.controller.dto;

import com.example.jobapplicationservice.model.enums.JobStatus;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Data
public class JobPostEditDTO {
    private String title;
    private String shortDescription;
    private String fullDescription;
    private List<String> jobTags;
    private JobStatus jobStatus;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate createdDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate updatedDate;
}

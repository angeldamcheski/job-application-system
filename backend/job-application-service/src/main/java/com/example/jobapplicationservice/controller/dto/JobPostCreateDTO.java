package com.example.jobapplicationservice.controller.dto;

import com.example.jobapplicationservice.model.enums.JobStatus;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Data
public class JobPostCreateDTO {
    private String title;
    private String shortDescription;
    private String fullDescription;
    private List<String> jobTags;
    private JobStatus jobStatus;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate creationDate;
    @DateTimeFormat(pattern = "YYYY-MM-dd")
    private LocalDate updateDate;

}

package com.example.jobapplicationservice.controller.dto;

import com.example.jobapplicationservice.model.enums.JobStatus;
import lombok.Data;

import java.util.List;

@Data
public class JobPostFilterDTO {
    private JobStatus jobStatus;
    private List<String> jobTags;
}

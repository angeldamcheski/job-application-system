package com.example.jobapplicationservice.controller.dto.JobPost;

import com.example.jobapplicationservice.model.enums.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class JobPostFilterDTO {
    private JobStatus jobStatus;
    private List<String> jobTags;

}

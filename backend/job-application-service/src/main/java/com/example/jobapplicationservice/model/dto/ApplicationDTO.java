package com.example.jobapplicationservice.model.dto;

import lombok.Data;

@Data
public class ApplicationDTO {
    private Long jobPostId;
    private Long applicantId;

    public ApplicationDTO(Long jobPostId, Long applicantId) {
        this.jobPostId = jobPostId;
        this.applicantId = applicantId;
    }
}

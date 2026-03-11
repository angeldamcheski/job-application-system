package com.example.jobapplicationservice.controller.dto.Application;

import com.example.jobapplicationservice.model.enums.ApplicationStatus;
import lombok.Data;

@Data
public class ApplicationStatusUpdateDTO {
    private ApplicationStatus status;
}

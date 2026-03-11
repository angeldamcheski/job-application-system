package com.example.jobapplicationservice.service;

import com.example.jobapplicationservice.controller.dto.Application.ApplicationFilterDTO;
import com.example.jobapplicationservice.controller.dto.Application.ApplicationViewDTO;
import com.example.jobapplicationservice.model.Application;
import com.example.jobapplicationservice.model.dto.ApplicationDTO;
import com.example.jobapplicationservice.model.enums.ApplicationStatus;

import java.util.List;

public interface ApplicationService {
    List<Application> listAllApplications();

    List<ApplicationViewDTO> listByJobPost(Long jobPostId);

    List<Application> filterApplications(ApplicationFilterDTO filter);

    Application apply(ApplicationDTO applicationDTO);

    List<ApplicationViewDTO> listByApplicant(Long applicantId);

    Application updateApplicationStatus(Long applicationId, ApplicationStatus applicationStatus);

    List<ApplicationViewDTO> listApplicationView();
}

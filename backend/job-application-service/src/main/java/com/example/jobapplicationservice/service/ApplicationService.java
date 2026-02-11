package com.example.jobapplicationservice.service;

import com.example.jobapplicationservice.controller.dto.ApplicationFilterDTO;
import com.example.jobapplicationservice.model.Application;

import java.util.List;

public interface ApplicationService {
    List<Application> listAllApplications();
    List<Application> filterApplications(ApplicationFilterDTO filter);

}

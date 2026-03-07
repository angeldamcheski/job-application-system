package com.example.jobapplicationservice.service;

import com.example.jobapplicationservice.controller.dto.ApplicantEditDTO;
import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.model.Application;

import java.util.List;

public interface ApplicantService {
    Applicant getById(Long id);
    List<Applicant> listAllApplicants();
    Applicant createApplicant(Applicant applicant);
    Applicant updateApplicant(Long id, ApplicantEditDTO updatedApplicant);
    void deleteApplicant(Long id);
}

package com.example.jobapplicationservice.service;

import com.example.jobapplicationservice.controller.dto.Applicant.ApplicantEditDTO;
import com.example.jobapplicationservice.model.Applicant;

import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ApplicantService {
    Applicant getById(Long id);
    List<Applicant> listAllApplicants();
    Applicant createApplicant(Applicant applicant);
    Applicant updateApplicant(Long id, ApplicantEditDTO updatedApplicant);
    void deleteApplicant(Long id);
    Page<Applicant> getPaginatedApplicants(Pageable pageable, String email);
    String uploadProfilePhoto(Long id, MultipartFile file)throws IOException;

}

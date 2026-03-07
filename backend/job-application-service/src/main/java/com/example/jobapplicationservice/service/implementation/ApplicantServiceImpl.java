package com.example.jobapplicationservice.service.implementation;

import com.example.jobapplicationservice.controller.dto.Applicant.ApplicantEditDTO;
import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.repository.ApplicantRepository;
import com.example.jobapplicationservice.service.ApplicantService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ApplicantServiceImpl implements ApplicantService {
    private final ApplicantRepository applicantRepository;

    public ApplicantServiceImpl(ApplicantRepository applicantRepository) {
        this.applicantRepository = applicantRepository;

    }

    @Override
    public Applicant getById(Long id) {
        return applicantRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Applicant with id: " + id + " is not found."));
    }

    @Override
    public List<Applicant> listAllApplicants() {
        return applicantRepository.findAll();
    }

    @Override
    public Applicant createApplicant(Applicant applicant) {
        return applicantRepository.save(applicant);
    }

    @Override
    public Applicant updateApplicant(Long id, ApplicantEditDTO applicantEditDto) {
        Applicant applicant = getById(id);

        if (applicantEditDto.getFirstName() != null) {
            applicant.setFirstName(applicantEditDto.getFirstName());
        }
        if (applicantEditDto.getLastName() != null) {
            applicant.setLastName(applicantEditDto.getLastName());
        }
        if (applicantEditDto.getEmailAddress() != null) {
            applicant.setEmailAddress(applicantEditDto.getEmailAddress());
        }
        if (applicantEditDto.getPhoneNumber() != null) {
            applicant.setPhoneNumber(applicantEditDto.getPhoneNumber());
        }
        if (applicantEditDto.getRole() != null) {
            applicant.setRole(applicantEditDto.getRole());
        }
        return applicantRepository.save(applicant);
    }

    @Override
    public void deleteApplicant(Long id) {
        Applicant applicant = getById(id);
        applicantRepository.delete(applicant);
    }
}

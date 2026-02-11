package com.example.jobapplicationservice.service.implementation;

import com.example.jobapplicationservice.controller.dto.ApplicationFilterDTO;
import com.example.jobapplicationservice.model.Application;
import com.example.jobapplicationservice.repository.ApplicationRepository;
import com.example.jobapplicationservice.repository.specifications.ApplicationSpecifications;
import com.example.jobapplicationservice.service.ApplicationService;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationServiceImpl implements ApplicationService {
    private final ApplicationRepository applicationRepository;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @Override
    public List<Application> listAllApplications() {
        return applicationRepository.findAll();
    }

    @Override
    public List<Application> filterApplications(ApplicationFilterDTO filter) {
        Specification<Application> spec = Specification.where((Specification<Application>) null);

        if (filter.getJobPostId() != null) {
            spec = spec.and(ApplicationSpecifications.filterByJobPost(filter.getJobPostId()));
        }

        if (filter.getApplicantName() != null) {
            spec = spec.and(ApplicationSpecifications.filterByApplicantName(filter.getApplicantName()));
        }
        if (filter.getEmail() != null) {
            spec = spec.and(ApplicationSpecifications.filterByEmail(filter.getEmail()));
        }
        if (filter.getPreferredLanguage() != null) {
            spec = spec.and(ApplicationSpecifications.filterByPreferredLanguage(filter.getPreferredLanguage()));
        }
        if (filter.getSubmittedFrom() != null) {
            spec = spec.and(ApplicationSpecifications.filterDateCreated(filter.getSubmittedFrom()));
        }
        if (filter.getSubmittedTo() != null) {
            spec = spec.and(ApplicationSpecifications.filterDateUpdated(filter.getSubmittedTo()));
        }


        return applicationRepository.findAll(spec);
    }
}

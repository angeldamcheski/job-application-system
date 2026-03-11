package com.example.jobapplicationservice.service.implementation;

import com.example.jobapplicationservice.controller.dto.Applicant.ApplicantDTO;
import com.example.jobapplicationservice.controller.dto.Application.ApplicationFilterDTO;
import com.example.jobapplicationservice.controller.dto.Application.ApplicationViewDTO;
import com.example.jobapplicationservice.controller.dto.JobPost.JobPostDTO;
import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.model.Application;
import com.example.jobapplicationservice.model.JobPost;
import com.example.jobapplicationservice.model.dto.ApplicationDTO;
import com.example.jobapplicationservice.model.enums.ApplicationStatus;
import com.example.jobapplicationservice.repository.ApplicationRepository;
import com.example.jobapplicationservice.repository.specifications.ApplicationSpecifications;
import com.example.jobapplicationservice.service.ApplicantService;
import com.example.jobapplicationservice.service.ApplicationService;
import com.example.jobapplicationservice.service.JobPostService;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationServiceImpl implements ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final JobPostService jobPostService;
    private final ApplicantService applicantService;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository, JobPostService jobPostService, ApplicantService applicantService) {
        this.applicationRepository = applicationRepository;
        this.jobPostService = jobPostService;

        this.applicantService = applicantService;
    }

    @Override
    public List<Application> listAllApplications() {
        return applicationRepository.findAll();
    }

    @Override
    public List<ApplicationViewDTO> listByJobPost(Long jobPostId) {
        JobPost jobPost = jobPostService.getJobPost(jobPostId);
        List<Application> applications = applicationRepository.findAllByJobPost(jobPost);
//        return applicationRepository.findAllByJobPost(jobPost);
        return applications.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ApplicationViewDTO mapToDTO(Application application) {
        ApplicationViewDTO dto = new ApplicationViewDTO();

        dto.setId(application.getId());

        JobPostDTO jobPostDTO = new JobPostDTO();
        jobPostDTO.setId(application.getJobPost().getId());
        jobPostDTO.setTitle(application.getJobPost().getTitle());
        dto.setJobPost(jobPostDTO);

        ApplicantDTO applicantDTO = new ApplicantDTO();
        applicantDTO.setId(application.getApplicant().getId());
        applicantDTO.setFirstName(application.getApplicant().getFirstName());
        applicantDTO.setLastName(application.getApplicant().getLastName());
        applicantDTO.setEmailAddress(application.getApplicant().getEmailAddress());
        applicantDTO.setPhoneNumber(application.getApplicant().getPhoneNumber());
        dto.setApplicant(applicantDTO);

        dto.setSubmittedDate(application.getSubmittedDate());
        dto.setApplicationStatus(application.getApplicationStatus());

        return dto;
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

    @Override
    public Application apply(ApplicationDTO applicationDTO) {
        JobPost job = jobPostService.getJobPost(applicationDTO.getJobPostId());
        Applicant applicant = applicantService.getById(applicationDTO.getApplicantId());

        boolean hasApplied = applicationRepository.existsByJobPostAndApplicant(job, applicant);
        if (hasApplied) {
            throw new IllegalStateException("You have already applied to this job.");
        }
        Application application = new Application();
        application.setJobPost(job);
        application.setApplicant(applicant);
        application.setSubmittedDate(LocalDate.now());
        application.setApplicationStatus(ApplicationStatus.SUBMITTED);
        applicationRepository.save(application);

        return application;
    }

    @Override
    public List<ApplicationViewDTO> listByApplicant(Long applicantId) {
        Applicant applicant = applicantService.getById(applicantId);
        // You can either use a repository method or stream the applicant's list
        return applicant.getApplications().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Application updateApplicationStatus(Long applicationId, ApplicationStatus applicationStatus) {
        Application application = applicationRepository.findById(applicationId).orElseThrow(() -> new RuntimeException("Application not found"));
        application.setApplicationStatus(applicationStatus);
        return applicationRepository.save(application);
    }

    @Override
    public List<ApplicationViewDTO> listApplicationView() {
        return applicationRepository.findAll().stream().map(this::mapToDTO).toList();
    }

}

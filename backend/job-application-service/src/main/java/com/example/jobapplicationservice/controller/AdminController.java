package com.example.jobapplicationservice.controller;

import com.example.jobapplicationservice.controller.dto.Application.ApplicationFilterDTO;
import com.example.jobapplicationservice.controller.dto.Application.ApplicationStatusUpdateDTO;
import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.model.Application;
import com.example.jobapplicationservice.controller.dto.Application.ApplicationViewDTO;
import com.example.jobapplicationservice.service.ApplicantService;
import com.example.jobapplicationservice.service.ApplicationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final ApplicantService applicantService;
    private final ApplicationService applicationService;

    public AdminController(ApplicantService applicantService, ApplicationService applicationService) {
        this.applicantService = applicantService;
        this.applicationService = applicationService;
    }

    /**
     * Get paginated list of applicants
     * URL Example: /api/admin/users?page=0&size=10
     */
    @GetMapping("/users")
    public ResponseEntity<Page<Applicant>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String email) {

        // We assume you'll add a paginated method to your ApplicantService
        Page<Applicant> applicants = applicantService.getPaginatedApplicants(
                PageRequest.of(page, size, Sort.by("id").descending()), email
        );
        return ResponseEntity.ok(applicants);
    }

    /**
     * Get applications for a specific user
     * Reuses the existing logic from ApplicationService
     */
    @GetMapping("/users/{userId}/applications")
    public ResponseEntity<List<ApplicationViewDTO>> getUserApplications(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.listByApplicant(userId));
    }

    @PatchMapping("/{applicationId}/status")
    public Application updateStatus(@PathVariable Long applicationId, @RequestBody ApplicationStatusUpdateDTO applicationStatusUpdateDTO){
        return applicationService.updateApplicationStatus(applicationId, applicationStatusUpdateDTO.getStatus());
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationViewDTO>> getAllApplications(){
        return ResponseEntity.ok(applicationService.listApplicationView());
    }
    @GetMapping("/applications/filter")
    public ResponseEntity<List<ApplicationViewDTO>> filterApplications(
            @ModelAttribute ApplicationFilterDTO filter) {

        return ResponseEntity.ok(applicationService.filterApplicationViewDTO(filter));
    }
}
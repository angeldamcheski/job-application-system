package com.example.jobapplicationservice.controller;

import com.example.jobapplicationservice.controller.dto.Application.ApplicationFilterDTO;
import com.example.jobapplicationservice.controller.dto.Application.ApplicationViewDTO;
import com.example.jobapplicationservice.model.Application;
import com.example.jobapplicationservice.model.dto.ApplicationDTO;
import com.example.jobapplicationservice.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173/")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<?> apply(@RequestBody ApplicationDTO applicationDTO) {
        try{
            Application application = applicationService.apply(applicationDTO);
            return ResponseEntity.ok(application);
        }catch(IllegalStateException e){
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }

    }


    @GetMapping()
    public List<Application> listAll() {
        return applicationService.listAllApplications();
    }
    @GetMapping("/by-job-post")
    public List<ApplicationViewDTO> listByJobPost(@RequestParam(required = false) Long jobPostId) {
        if (jobPostId != null) {
            return applicationService.listByJobPost(jobPostId);
        }
        return List.of();
    }

    @GetMapping("/filter")
    public List<Application> filter(@ModelAttribute ApplicationFilterDTO filter) {
        return applicationService.filterApplications(filter);
    }
    @PreAuthorize("hasRole('APPLICANT')")
    @GetMapping("/applicant/{applicantId}")
    public ResponseEntity<List<ApplicationViewDTO>> getApplicationsByApplicant(@PathVariable Long applicantId){
        return ResponseEntity.ok(applicationService.listByApplicant(applicantId));
    }
}

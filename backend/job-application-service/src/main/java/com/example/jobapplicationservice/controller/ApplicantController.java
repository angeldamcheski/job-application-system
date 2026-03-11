package com.example.jobapplicationservice.controller;

import com.example.jobapplicationservice.controller.dto.Applicant.ApplicantEditDTO;
import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.service.ApplicantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/applicants")
@RestController
public class ApplicantController {
    private final ApplicantService applicantService;

    public ApplicantController(ApplicantService applicantService) {
        this.applicantService = applicantService;
    }

    @PutMapping("/{applicantId}")
    public ResponseEntity<Applicant> updateApplicant(@PathVariable Long applicantId, @RequestBody ApplicantEditDTO applicantEditDTO){
        Applicant updatedApplicant = applicantService.updateApplicant(applicantId, applicantEditDTO);
        return ResponseEntity.ok(updatedApplicant);
    }
}

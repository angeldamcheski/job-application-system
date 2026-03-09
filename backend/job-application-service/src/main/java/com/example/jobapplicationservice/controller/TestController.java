package com.example.jobapplicationservice.controller;

import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.model.enums.UserRole;
import com.example.jobapplicationservice.service.ApplicantService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {
    private final ApplicantService applicantService;

    public TestController(ApplicantService applicantService) {
        this.applicantService = applicantService;
    }

    @PostMapping("/create-dummy-applicant")
    public Applicant createDummy() {
        Applicant dummy = new Applicant();
        dummy.setFirstName("John");
        dummy.setLastName("Doe");
        dummy.setEmailAddress("john.doe@example.com");
        dummy.setPhoneNumber("+123456789");
        dummy.setRole(UserRole.APPLICANT);
        return applicantService.createApplicant(dummy);
    }
    @GetMapping()
    public String test(Authentication authentication){
        return authentication == null ? "NO AUTH" : authentication.getName();
    }
}

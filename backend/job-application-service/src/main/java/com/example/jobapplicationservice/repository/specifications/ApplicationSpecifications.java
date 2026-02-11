package com.example.jobapplicationservice.repository.specifications;

import com.example.jobapplicationservice.model.Application;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.Date;

public class ApplicationSpecifications {
    public static Specification<Application> filterByJobPost(Long jobPostId){
        return (root, query, cb)->cb.equal(root.get("jobPost").get("id"), jobPostId);
    }

    public static Specification<Application> filterByApplicantName(String applicantName){
        return (root, query, cb)->cb.like(cb.lower(root.get("applicant").get("firstName")), "%"+applicantName.toLowerCase()+"%");
    }
    public static Specification<Application> filterByEmail(String email){
        return (root, query, cb) -> cb.equal(root.get("applicant").get("email"),email);
    }
    public static Specification<Application> filterByPreferredLanguage(String preferredLanguage){
        return (root, query, cb)->cb.equal(root.get("preferredLanguage"), preferredLanguage);
    }
    public static Specification<Application> filterDateCreated(LocalDate submissionDate){
        return (root, query, cb)->cb.equal(root.get("submittedFrom"), submissionDate);
    };
    public static Specification<Application> filterDateUpdated(LocalDate submissionDate){
        return (root, query, cb)->cb.equal(root.get("submittedTo"), submissionDate);
    };
}

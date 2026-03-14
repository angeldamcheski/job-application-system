package com.example.jobapplicationservice.repository;

import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.model.Application;
import com.example.jobapplicationservice.model.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long>, JpaSpecificationExecutor<Application> {
    List<Application> findAllByJobPost(JobPost jobPost);
    List<Application> findByApplicantId(Long applicantId);
    Boolean existsByJobPostAndApplicant(JobPost jobPost, Applicant applicant);
}

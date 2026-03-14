package com.example.jobapplicationservice.repository;

import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.model.Cv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CvRepository extends JpaRepository<Cv, Long> {
    Optional<Cv> findByApplicant(Applicant applicant);
    Cv findByApplicantId(Long applicantId);
}

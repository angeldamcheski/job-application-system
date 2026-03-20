package com.example.jobapplicationservice.repository;

import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByApplicant(Applicant applicant);
    void deleteBookmarkByApplicantIdAndJobPost_Id(Long applicantId, Long jobPostId);
    boolean existsByApplicant_IdAndJobPost_Id(Long applicantId, Long jobPostId);
}

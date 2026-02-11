package com.example.jobapplicationservice.repository;

import com.example.jobapplicationservice.model.JobPost;
import com.example.jobapplicationservice.model.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, Long>, JpaSpecificationExecutor<JobPost> {
    List<JobPost> findJobPostsByJobStatus(JobStatus jobStatus);

    List<JobPost> findJobPostsByJobTags(String jobTags);
}

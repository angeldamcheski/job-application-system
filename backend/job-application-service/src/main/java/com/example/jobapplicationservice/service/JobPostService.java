package com.example.jobapplicationservice.service;

import com.example.jobapplicationservice.controller.dto.JobPostCreateDTO;
import com.example.jobapplicationservice.controller.dto.JobPostEditDTO;
import com.example.jobapplicationservice.controller.dto.JobPostFilterDTO;
import com.example.jobapplicationservice.model.JobPost;

import java.util.List;

public interface JobPostService {
    JobPost getJobPost(Long id);

    JobPost createJobPost(JobPostCreateDTO jobPostCreateDto);

    JobPost editJobPost(Long id, JobPostEditDTO jobPostEditDto);

    JobPost deleteJobPost(Long id);

    String toggleJobStatus(Long id);

    List<JobPost> listJobPosts(JobPostFilterDTO jobPostFilterDTO);

}
